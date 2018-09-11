import { Log } from '../../typings/log';
import { ChestnutIdentity } from './oauth-model';
import { createAuthUserRepository, createAuthTokenRepository } from './repositories';
import { verifyUser } from './password-service';


export function createAuth(app, store, logger: Log) {

    const configuration = {
        issuer: `http://localhost:9000`,
        secretKey: '5rzz289v303zg',
        tokenExpiration: 3600,
        refreshTokenExpiration: 86400,
        maxFailedLoginAttempts: 3,
        waitTimeToUnlockUser: 5,
    };

    const authUserRepository = createAuthUserRepository(store);
    const authTokenRepository = createAuthTokenRepository(store);

    logger.info('initializing identity');
    const identity = new ChestnutIdentity(
        authUserRepository,
        authTokenRepository,
        verifyUser,
        {
            issuer: configuration.issuer,
            secretKey: configuration.secretKey,
            tokenExpiration: configuration.tokenExpiration,
            refreshTokenExpiration: configuration.refreshTokenExpiration,
            maxFailedLoginAttempts: configuration.maxFailedLoginAttempts,
            waitTimeToUnlockUser: configuration.waitTimeToUnlockUser,
        }
    );

    app.post('/auth/token', identity.grant());
}
