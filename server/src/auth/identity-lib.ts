import * as jwt from 'jsonwebtoken';
import * as uuidV4 from 'uuid';
import * as crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { Observable, of } from 'rxjs';
import { filter, map, merge, flatMap, catchError, tap } from 'rxjs/operators';
import { PasswordTokenRequest, RefreshTokenRequest } from '../utils/auth-requests';

export type Success<T> = {
    isSuccess: true;
    value: T;
};

export type Failure<T> = {
    isSuccess: false;
    type: string;
    error: T;
};

export function success<T>(value?: T): Success<T> {
    return <Success<T>>{
        isSuccess: true,
        value: value,
    };
}

export function failure<T>(type: string, error?: T): Failure<T> {
    return <Failure<T>>{
        isSuccess: false,
        type: type,
        error: error,
    };
}

export type ModelError = {
    type: 'ModelError';
    message: string;
    translationKey?: string;
    translationObject?: any;
    fieldErrors?: FieldError[];
};

export type FieldError = {
    field: string;
    message: string;
    translationKey: string;
    translationObject?: any;
};

export type Token = {
    jti: string;
    iss: string;
    sub: string;
    exp: number;
    iat: number;
    name: string;
    permissions: string;
};

export type IdentityUser = {
    _id: string;
    email: string;
    permissions: string;
};

export type TokenRequest = PasswordTokenRequest | RefreshTokenRequest;

export type IdentityConfig = {
    issuer: string;
    secretKey: string;
    tokenExpiration: number;
    refreshTokenExpiration: number;
};

export type TokenData = {
    token: Token;
    signedToken: string;
    refreshToken: string;
    refreshTokenExpiration: Date;
    identity: IdentityUser;
    clientId: string;
};

export type RefreshToken = {
    refreshToken: string;
    expires: Date;
    userId: string;
    clientId: string;
};

const AUTHORIZATION_HEADER = 'authorization';

export const ensureToken = (req: Request & { token: string }, res: Response, next: NextFunction): void => {
    const bearerHeader: string = <string>req.headers[AUTHORIZATION_HEADER];

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
};

const generateRefreshToken = async (): Promise<string> => {
    return new Promise<string>(async function(resolve: any, reject: any) {
        crypto.randomBytes(256, function(error: Error, buffer: Buffer): void {
            if (error) {
                return reject(error);
            }

            return resolve(
                crypto
                    .createHash('sha1')
                    .update(buffer)
                    .digest('hex')
            );
        });
    });
};

const onSuccess = <T, R>(f: (r: Success<R>) => Promise<T>) => (
    result: Success<R> | Failure<ModelError> | Failure<Error> | Failure<string>
): Promise<T | Failure<ModelError> | Failure<Error> | Failure<string>> =>
    !result.isSuccess
        ? (Promise.resolve(result) as Promise<Failure<ModelError> | Failure<Error> | Failure<string>>)
        : f(result);

export class Identity {
    constructor(private configuration: IdentityConfig) {}

    public grant(): (req: Request, res: Response, next: NextFunction) => Promise<void> {
        return async (req: Request, res: Response, next: NextFunction) => {
            const request: TokenRequest = req.body;

            const password$: Observable<void> = of(request as PasswordTokenRequest).pipe(
                filter<PasswordTokenRequest>((p: TokenRequest) => p.grant_type === 'password'),
                this.grantPassword(),
                this.renderResponse(req, res, next)
            );

            const refreshToken$: Observable<void> = of(request as RefreshTokenRequest).pipe(
                filter<RefreshTokenRequest>((p: TokenRequest) => p.grant_type === 'refresh_token'),
                this.grantRefreshToken(),
                this.renderResponse(req, res, next)
            );

            const undefined$: Observable<void> = of(request).pipe(
                filter(x => x.grant_type !== 'password' && x.grant_type !== 'refresh_token'),
                map(_ => {
                    res.sendStatus(500);
                    next();
                })
            );

            return password$.pipe(merge(refreshToken$, undefined$)).toPromise();
        };
    }

    public decodeToken() {
        const secretKey = this.configuration.secretKey;
        return (req: any, _, next: NextFunction): void => {
            jwt.verify(req.token, secretKey, (err: Error, data: any) => {
                if (err) {
                    req.sendStatus(403);
                    next();
                } else {
                    req.jsonwebtoken = data;
                }
            });
        };
    }

    private renderResponse(_, res: Response, next: NextFunction) {
        return (source: Observable<Success<TokenData> | Failure<ModelError | Error | string>>) => {
            return source.pipe(
                map(x => {
                    x.isSuccess
                        ? res.json({
                              token_type: 'bearer',
                              access_token: x.value.signedToken,
                              expires_in: this.configuration.tokenExpiration,
                              refresh_token: x.value.refreshToken,
                          })
                        : (<Failure<ModelError>>x).type
                        ? res.status(400).json((<Failure<ModelError>>x).error)
                        : res.status(500).json((<Failure<Error | string>>x).error);
                    next();
                })
            );
        };
    }

    private grantRefreshToken() {
        return (source: Observable<RefreshTokenRequest>) => {
            return source.pipe(
                map(this.validateRefreshTokenRequest),
                flatMap(
                    onSuccess(result =>
                        this.loadRefreshToken(result.value.refresh_token, result.value.client_id).then(token =>
                            this.validateRefreshToken(token)
                        )
                    )
                ),
                flatMap(
                    onSuccess<any, RefreshToken>(r =>
                        this.loadUserForRefreshToken(r.value).then(
                            onSuccess(identity => this.generateToken(identity.value, r.value.clientId))
                        )
                    )
                ),
                flatMap(
                    onSuccess<any, TokenData>(res =>
                        this.saveAccessToken(
                            res.value.signedToken,
                            res.value.clientId,
                            new Date(res.value.token.exp * 1000),
                            res.value.identity
                        ).then(_ =>
                            this.saveRefreshToken(
                                res.value.refreshToken,
                                res.value.clientId,
                                res.value.refreshTokenExpiration,
                                res.value.identity
                            ).then(() => res)
                        )
                    )
                ),
                catchError((error: Error) => of(failure<Error>('UNEXPECTED_ERROR', error)))
            );
        };
    }

    private grantPassword() {
        return (source: Observable<PasswordTokenRequest>) => {
            return source.pipe(
                map(this.validatePasswordTokenRequest),
                flatMap(
                    onSuccess<Success<TokenData>, PasswordTokenRequest>(result =>
                        this.loadUser(result.value).then(
                            onSuccess<any, IdentityUser>(identity =>
                                this.generateToken(identity.value, result.value.client_id)
                            )
                        )
                    )
                ),
                flatMap(
                    onSuccess(res =>
                        this.saveAccessToken(
                            res.value.signedToken,
                            res.value.clientId,
                            new Date(res.value.token.exp * 1000),
                            res.value.identity
                        ).then(_ =>
                            this.saveRefreshToken(
                                res.value.refreshToken,
                                res.value.clientId,
                                res.value.refreshTokenExpiration,
                                res.value.identity
                            ).then(() => res)
                        )
                    )
                ),
                catchError((error: Error) => of(failure<Error>('UNEXPECTED_ERROR', error)))
            );
        };
    }

    private generateToken(identity: IdentityUser, clientId: string): Promise<Success<TokenData>> {
        return this.removeTokens(identity, clientId).then(_ =>
            generateRefreshToken()
                .then(refreshToken => ({ identity, refreshToken }))
                .then(combined =>
                    this.generateAccessToken(combined.identity).then(token => ({
                        token,
                        identity: combined.identity,
                        refreshToken: combined.refreshToken,
                    }))
                )
                .then(all =>
                    success({
                        identity: identity,
                        token: all.token,
                        signedToken: this.signToken(all.token),
                        refreshToken: all.refreshToken,
                        refreshTokenExpiration: new Date(
                            (Math.floor(Date.now() / 1000) + this.configuration.refreshTokenExpiration) * 1000
                        ),
                        clientId,
                    })
                )
        );
    }

    private async generateAccessToken(user: IdentityUser): Promise<Token> {
        return Promise.resolve(<Token>{
            jti: uuidV4(),
            iss: this.configuration.issuer,
            sub: '' + user._id,
            exp: Math.floor(Date.now() / 1000) + this.configuration.tokenExpiration,
            iat: Math.floor(Date.now() / 1000),
            name: user.email,
            permissions: user.permissions,
        });
    }

    private signToken(token: Token): string {
        return jwt.sign(token, this.configuration.secretKey);
    }

    // implement specific
    public validatePasswordTokenRequest(
        request: PasswordTokenRequest
    ): Success<PasswordTokenRequest> | Failure<ModelError> {
        throw 'NOT_IMPLEMENTED';
    }

    public validateRefreshTokenRequest(
        request: RefreshTokenRequest
    ): Success<RefreshTokenRequest> | Failure<ModelError> {
        throw 'NOT_IMPLEMENTED';
    }

    public async loadUser(
        request: PasswordTokenRequest
    ): Promise<Success<IdentityUser> | Failure<ModelError> | Failure<string>> {
        return Promise.reject('NOT_IMPLEMENTED');
    }

    public async loadUserForRefreshToken(
        request: RefreshToken
    ): Promise<Success<IdentityUser> | Failure<ModelError> | Failure<string>> {
        return Promise.reject('NOT_IMPLEMENTED');
    }

    public async saveAccessToken(
        signedAccessToken: string,
        clientId: string,
        expires: Date,
        user: IdentityUser
    ): Promise<void> {
        return Promise.reject('NOT_IMPLEMENTED');
    }

    public async saveRefreshToken(
        refreshToken: string,
        clientId: string,
        expires: Date,
        user: IdentityUser
    ): Promise<void> {
        return Promise.reject('NOT_IMPLEMENTED');
    }

    public async loadRefreshToken(refreshToken: string, clientId: string): Promise<RefreshToken> {
        return Promise.reject('NOT_IMPLEMENTED');
    }

    public async removeTokens(identity: IdentityUser, clientId: string): Promise<void> {
        return Promise.reject('NOT_IMPLEMENTED');
    }

    public async removeRefreshToken(token: string): Promise<void> {
        return Promise.reject('NOT_IMPLEMENTED');
    }

    public async removeAccessToken(accessToken: string): Promise<void> {
        return Promise.reject('NOT_IMPLEMENTED');
    }

    public validateRefreshToken(
        refreshToken: RefreshToken
    ): Success<RefreshToken> | Failure<ModelError> | Failure<Error> | Failure<string> {
        throw 'NOT_IMPLEMENTED';
    }
}
