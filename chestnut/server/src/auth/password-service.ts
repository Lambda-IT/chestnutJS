import * as crypto from 'crypto';
import { AuthUser } from './models';

export function createSalt() {
    const len = 8;
    return crypto
        .randomBytes(Math.ceil(len / 2))
        .toString('hex')
        .substring(0, len);
}

export function computeHash(source: string, salt: string) {
    const hmac = crypto.createHmac('sha1', salt);
    const hash = hmac.update(source);
    return hash.digest('hex');
}

export function verifyUser(password: string, user: AuthUser) {
    const testHash = computeHash(password, user.salt);

    if (testHash === user.passwordHash) {
        return user;
    }

    throw new Error('INVALID_CREDENTIALS');
}
