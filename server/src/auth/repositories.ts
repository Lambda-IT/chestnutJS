import { AuthUser, AuthToken, TokenType } from './models';
import { AuthUserRepository, AuthTokenRepository } from './oauth-model';
import { Store, COULD_NOT_WRITE_TO_SERVER } from '../store';
import { ChestnutUser } from '../chestnut-user-type';
import { computeHash, createSalt } from './password-service';

export const createAuthTokenRepository = (store: Store): AuthTokenRepository => ({
    async addToken(authToken: AuthToken): Promise<string> {
        const result: any = await store.models.authToken.insertMany(authToken);
        if (result.length !== 1) {
            throw Error(COULD_NOT_WRITE_TO_SERVER);
        }
        return result[0]._id.toString();
    },
    async getRefreshToken(token: string, clientId: string): Promise<AuthToken> {
        return await store.models.authToken.findOne({ token: token, clientId: clientId, type: TokenType.refresh });
    },
    async removeRefreshToken(token: string): Promise<string> {
        await store.models.authToken.remove({ token: token, type: TokenType.refresh });
        return token;
    },
    async removeAccessToken(accessToken: string): Promise<void> {
        await store.models.authToken.remove({ token: accessToken, type: TokenType.access });
    },
    async removeTokenByUser(userId: string, clientId: string): Promise<void> {
        await store.models.authToken.remove({ userId: userId, clientId: clientId });
    },
});

export const createAuthUserRepository = (store: Store): AuthUserRepository => ({
    async getRegisteredUser(email: string): Promise<AuthUser> {
        return await store.models.authUser.findOne({ email: email, deleted: false });
    },
    async getUser(email: string): Promise<AuthUser> {
        return await store.models.authUser.findOne({ email: email, deleted: false, activated: true });
    },
    async updateUser(authUser: AuthUser) {
        // const updateUser = { ...user };
        // delete (<any>updateUser)._id;
        const result = await store.models.authUser.updateOne({ email: authUser.email, deleted: false }, authUser, {
            upsert: false,
        });
        if (result.ok !== 1) {
            throw Error(COULD_NOT_WRITE_TO_SERVER);
        }
    },
    async createUser(chestnutUser: ChestnutUser): Promise<string> {
        const salt = createSalt();
        const createUser: Partial<AuthUser> = {
            firstname: chestnutUser.firstname,
            lastname: chestnutUser.lastname,
            email: chestnutUser.email,
            language: chestnutUser.language,
            permissions: chestnutUser.permissions,
            passwordHash: computeHash(chestnutUser.password, salt),
            salt,
            failedLoginAttemps: 0,
            locked: false,
            deleted: false,
            activated: true,
            lastLoginAttempt: new Date('01-01-1970'),
        };
        delete (<any>createUser).password;
        const result = await store.models.authUser.insertMany(createUser);
        if (result.length !== 1) {
            throw Error(COULD_NOT_WRITE_TO_SERVER);
        }
        return result[0]._id.toString();
    },
});
