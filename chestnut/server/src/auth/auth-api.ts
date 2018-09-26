import { Log } from '../../typings/log';
import { ChestnutIdentity } from './oauth-model';
import { createAuthUserRepository, createAuthTokenRepository } from './repositories';
import { verifyUser } from './password-service';


export function createAuth(configuration: any, app, store, logger: Log) {

    const authUserRepository = createAuthUserRepository(store);
    const authTokenRepository = createAuthTokenRepository(store);

    logger.info('initializing identity');
    const identity = new ChestnutIdentity(
        authUserRepository,
        authTokenRepository,
        verifyUser,
        configuration
    );

    app.post('/auth/token', identity.grant());

    return identity;
}
