import { UpdateFunction, createUserAsync } from '../../..';
import { Store } from '../../src/store';
import { Log } from '../../typings/log';
import { ChestnutPermissions } from '../../src/auth/models';

export const update: UpdateFunction = async function(store: Store, logger: Log) {
    await createUserAsync(store, {
        email: 'admin@lambda-it.ch',
        firstname: 'admin',
        language: 'de',
        lastname: 'admin',
        password: 'admin',
        permissions: ChestnutPermissions.write,
    });

    logger.info('created admin, with pw admin');
};
