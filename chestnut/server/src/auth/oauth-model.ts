import * as moment from 'moment';
import * as _ from 'lodash';
import * as jwt from 'jsonwebtoken';
import * as uuidV4 from 'uuid/v4';
import { Identity, failure, success, Success, Failure, ModelError, PasswordTokenRequest, RefreshTokenRequest, IdentityUser, RefreshToken, Token } from './identity-lib';
import { AuthToken, AuthUser, ChestnutPermissions, TokenType } from './models';
import { isNullOrEmpty } from '../../../common';

export type Result<T> = Success<T> | Failure<string>;

export interface AuthUserRepository {
    getRegisteredUser(email: string): Promise<AuthUser>;
    updateUser(user: AuthUser): Promise<void>;
    getUser(email: string): Promise<AuthUser>;
}

export interface AuthTokenRepository {
    addToken(authToken: AuthToken): Promise<string>;
    getRefreshToken(token: string, clientId: string): Promise<AuthToken>;
    removeRefreshToken(token: string): Promise<string>;
    removeTokenByUser(userId: string, clientId: string): Promise<void>;
    removeAccessToken(accessToken: string): Promise<void>;
}

export interface VerifyUserFunction {
    (loginUser: PasswordTokenRequest, user: AuthUser): Result<AuthUser>;
}

export interface ComputeHashFunction {
    (source: string, salt: string): string;
}

export interface PasswordService {
    createSalt: () => string;
    computeHash: ComputeHashFunction;
}

export class ChestnutIdentity extends Identity {

    constructor(
        private authUserRepository: AuthUserRepository,
        private authTokenRepository: AuthTokenRepository,
        private verifyUser: VerifyUserFunction,
        private internalConfiguration: {
            issuer: string,
            secretKey: string,
            tokenExpiration: number,
            refreshTokenExpiration: number,
            maxFailedLoginAttempts: number,
            waitTimeToUnlockUser: number,
        }
    ) {
        super(internalConfiguration);
    }

    public validatePasswordTokenRequest(
        request: PasswordTokenRequest
    ): Success<PasswordTokenRequest> | Failure<ModelError> {
        let modelError = <ModelError>{ fieldErrors: [] };

        if (isNullOrEmpty(request.password)) {
            modelError.fieldErrors = [
                ...modelError.fieldErrors,
                {
                    field: 'password',
                    message: 'password must be set',
                    translationKey: 'SHARED.VALIDATIONERROR.REQUIREDPASSWORD',
                },
            ];
        }

        if (isNullOrEmpty(request.username)) {
            modelError.fieldErrors = [
                ...modelError.fieldErrors,
                {
                    field: 'username',
                    message: 'username must be set',
                    translationKey: 'SHARED.VALIDATIONERROR.REQUIREDUSERNAME',
                },
            ];
        }

        if (isNullOrEmpty(request.client_id)) {
            modelError.fieldErrors = [
                ...modelError.fieldErrors,
                {
                    field: 'client_id',
                    message: 'client_id must be set',
                    translationKey: 'SHARED.VALIDATIONERROR.MISSINGCLIENTID',
                },
            ];
        }

        if (modelError.fieldErrors.length > 0) {
            modelError.message = 'ValidationFailed';
            return failure<ModelError>('Validation', modelError);
        }

        return success<PasswordTokenRequest>(request);
    }

    public validateRefreshTokenRequest(
        request: RefreshTokenRequest
    ): Success<RefreshTokenRequest> | Failure<ModelError> {
        let modelError = <ModelError>{ fieldErrors: [] };

        if (isNullOrEmpty(request.refresh_token)) {
            modelError.fieldErrors = [
                ...modelError.fieldErrors,
                {
                    field: 'refresh_token',
                    message: 'refresh_token must be set',
                    translationKey: 'SHARED.VALIDATIONERROR.REQUIREDREFRESHTOKEN',
                },
            ];
        }

        if (isNullOrEmpty(request.client_id)) {
            modelError.fieldErrors = [
                ...modelError.fieldErrors,
                {
                    field: 'client_id',
                    message: 'client_id must be set',
                    translationKey: 'SHARED.VALIDATIONERROR.MISSINGCLIENTID',
                },
            ];
        }

        if (modelError.fieldErrors.length > 0) {
            modelError.message = 'ValidationFailed';
            return failure<ModelError>('Validation', modelError);
        }

        return success<RefreshTokenRequest>(request);
    }

    public async loadUser(
        request: PasswordTokenRequest
    ): Promise<Success<IdentityUser> | Failure<ModelError> | Failure<string>> {
        const authUser = await this.authUserRepository.getRegisteredUser(request.username);
        if (!authUser) {
            return failure<ModelError>('BusinessError', {
                type: 'ModelError',
                message: 'User not found',
                translationKey: 'SHARED.VALIDATIONERROR.USERNOTFOUND',
            });
        }

        if (authUser.locked) {
            if (
                authUser.lastLoginAttempt >
                moment
                    .utc()
                    .subtract({ minutes: this.internalConfiguration.waitTimeToUnlockUser })
                    .toDate()
            ) {
                return failure<ModelError>('BusinessError', {
                    type: 'ModelError',
                    message: 'User locked out',
                    translationKey: 'SHARED.VALIDATIONERROR.USERLOCKED',
                });
            }
        }
        if (!authUser.activated) {
            return failure<ModelError>('BusinessError', {
                type: 'ModelError',
                message: 'User not activated',
                translationKey: 'SHARED.VALIDATIONERROR.USERNOTACTIVATED',
            });
        }
        const result = this.verifyUser(request, authUser);
        if (result.isSuccess === true) {
            authUser.locked = false;
            authUser.failedLoginAttemps = 0;
            authUser.lastLoginAttempt = moment.utc().toDate();

            await this.authUserRepository.updateUser(authUser);
            return success<IdentityUser>({
                _id: (<any>authUser)._id.toString(),
                email: authUser.email,
                permissions: ChestnutPermissions[authUser.permissions]
            });
        } else {
            authUser.failedLoginAttemps = !!authUser.failedLoginAttemps ? authUser.failedLoginAttemps + 1 : 1;
            authUser.lastLoginAttempt = moment.utc().toDate();
            authUser.locked = authUser.failedLoginAttemps >= this.internalConfiguration.maxFailedLoginAttempts;
            await this.authUserRepository.updateUser(authUser);
            return failure<ModelError>('InvalidCredentials', {
                type: 'ModelError',
                message: 'Invalid credentials',
                translationKey: 'DIALOG.LOGIN.LOGINFAILEDDESCRIPTION',
            });
        }
    }

    public async loadUserForRefreshToken(
        request: RefreshToken
    ): Promise<Success<IdentityUser> | Failure<ModelError> | Failure<string>> {
        const authUser = await this.authUserRepository.getUser(request.userId);

        if (authUser.locked) {
            return failure<ModelError>('BusinessError', {
                type: 'ModelError',
                message: 'User locked out',
                translationKey: 'SHARED.VALIDATIONERROR.USERLOCKED',
            });
        }

        return success({
            _id: (<any>authUser)._id.toString(),
            email: authUser.email,
            permissions: ChestnutPermissions[authUser.permissions]
        });
    }

    public async saveAccessToken(signedAccessToken: string, clientId: string, expires: Date, user: IdentityUser): Promise<void> {
        const authToken = new AuthToken();
        authToken.token = signedAccessToken;
        authToken.clientId = clientId;
        authToken.expires = expires;
        authToken.userId = user.email;
        authToken.type = TokenType.access;
        await this.authTokenRepository.addToken(authToken);
    }

    public async loadRefreshToken(refreshToken: string, clientId: string): Promise<RefreshToken> {
        const token = await this.authTokenRepository.getRefreshToken(refreshToken, clientId);
        if (!token) {
            throw 'RefreshToken invalid';
        }

        return { clientId: token.clientId, expires: token.expires, userId: token.userId, refreshToken: token.token };
    }

    public async saveRefreshToken(
        token: string,
        clientId: string,
        expires: Date,
        user: IdentityUser
    ): Promise<void> {
        const authToken = new AuthToken();
        authToken.token = token;
        authToken.clientId = clientId;
        authToken.expires = expires;
        authToken.userId = user.email;
        authToken.type = TokenType.refresh;
        await this.authTokenRepository.addToken(authToken);
    }

    public async removeAccessToken(accessToken: string): Promise<void> {
        await this.authTokenRepository.removeAccessToken(accessToken);
    }

    public async removeRefreshToken(token: string): Promise<void> {
        await this.authTokenRepository.removeRefreshToken(token);
    }

    public async removeTokens(identity: IdentityUser, clientId: string): Promise<void> {
        await this.authTokenRepository.removeTokenByUser(identity.email, clientId);
    }

    public validateRefreshToken(
        refreshToken: RefreshToken
    ): Success<RefreshToken> | Failure<ModelError> | Failure<Error> | Failure<string> {
        return valid(refreshToken) ? success(refreshToken) : failure('InvalidCredentials', 'INVALID_CREDENTIALS');
    }
}

export function generateAccessToken(userRepository, configuration, username, callback) {
    userRepository.getUserAsync(username).then((authUser: AuthUser) => {
        if (!authUser) {
            return callback('Username invalid.');
        }

        const token = jwt.sign(
            <Token>{
                jti: uuidV4(),
                iss: configuration.issuer,
                sub: '' + (<any>authUser)._id,
                exp: Math.floor(Date.now() / 1000) + configuration.tokenExpiration,
                iat: Math.floor(Date.now() / 1000),
                name: authUser.email,
                permissions: ChestnutPermissions[authUser.permissions],
            },
            configuration.secretKey
        );

        return callback(null, token);
    }, callback);
}

export function valid(token: RefreshToken) {
    return token.expires.getTime() / 1000 > Math.floor(Date.now() / 1000);
}
