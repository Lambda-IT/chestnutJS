import * as jwt from 'jsonwebtoken';
import { ChestnutIdentity } from './oauth-model';
import { Token } from './identity-lib';
import { Request, Response } from '../middleware';
import { NextFunction } from 'express';

export const NOT_AUTHORIZED = 'NOT_AUTHORIZED';

export function createAuthorizationHandler(identity: ChestnutIdentity, configuration: any) {
    async function ensureAuthorized(request: Request, response: Response, next: NextFunction) {
        try {
            request['accessToken'] = await checkAuthorized(request);
            next();
        } catch (err) {
            if (err.message === NOT_AUTHORIZED) return response.notAuthorized();
            next(err);
        }
    }

    async function checkAuthorized(request: Request): Promise<Token> {
        try {
            const authorizationHeader = request.header('authorization');
            if (!authorizationHeader && !request.query.token) {
                throw new Error('NOT_AUTHORIZED');
            }

            const token = request.query.token || authorizationHeader.substr(7);
            if (!token || token === 'undefined') {
                throw new Error('NOT_AUTHORIZED');
            }

            try {
                const decodedToken = jwt.verify(token, configuration.secretKey) as Token;

                if (decodedToken.iss !== configuration.issuer) {
                    throw new Error('NOT_AUTHORIZED');
                }

                if (decodedToken.exp < Math.floor(Date.now() / 1000)) {
                    await identity.removeAccessToken(token);
                    throw new Error('NOT_AUTHORIZED');
                }

                return Promise.resolve(decodedToken);
            } catch (error) {
                throw new Error('NOT_AUTHORIZED');
            }
        } catch (err) {
            if (err.message !== NOT_AUTHORIZED) {
                throw new Error('NOT_AUTHORIZED');
            }
            throw err;
        }
    }

    return {
        ensureAuthorized: ensureAuthorized
    };
}
