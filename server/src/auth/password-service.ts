import * as crypto from 'crypto';
import { AuthUser } from './models';
import { success, failure } from './identity-lib';
import { PasswordTokenRequest } from '../utils/auth-requests';

export const createSalt = () => {
    const len = 8;
    return crypto
        .randomBytes(Math.ceil(len / 2))
        .toString('hex')
        .substring(0, len);
};

export const computeHash = (source: string, salt: string) => {
    const hmac = crypto.createHmac('sha1', salt);
    const hash = hmac.update(source);
    return hash.digest('hex');
};

export const verifyUser = (passwordTokenRequest: PasswordTokenRequest, authUser: AuthUser) => {
    const testHash = computeHash(passwordTokenRequest.password, authUser.salt);

    if (testHash === authUser.passwordHash) {
        return success(authUser);
    }

    return failure<string>('INVALID_CREDENTIALS');
};
