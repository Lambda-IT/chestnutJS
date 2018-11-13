import * as _ from 'lodash';
import * as path from 'path';

import { mapSeries } from 'bluebird';
import { Store, COULD_NOT_WRITE_TO_SERVER } from './store';
import { Log } from '../typings/log';
import { Typegoose, prop } from 'typegoose';
import { readonly } from './decorators';

export type UpdateFunction = (mongoStore: Store, logger: Log) => Promise<void>;

export async function updateServer(
    mongoStore: Store,
    serverConfig: ServerConfig,
    availableUpdateFiles: string[],
    serverConfigRepository: ServerConfigRepository,
    logger: Log
) {
    const updating = await serverConfigRepository.isUpdateInProcessAsync();

    if (updating) return;

    try {
        await serverConfigRepository.setUpdateInProcessAsync(true);

        availableUpdateFiles = availableUpdateFiles.filter(x => path.extname(x) === '.js');

        const updatesToProcess = _.differenceBy(availableUpdateFiles, serverConfig.processedUpdates || [], x =>
            path.basename(x)
        );

        logger.info('updates to do', {
            updatesToProcess: updatesToProcess.map(x => path.basename(x)),
            // availableUpdateFiles: availableUpdateFiles.map(x => path.basename(x)),
        });

        await mapSeries(_.sortBy(updatesToProcess, x => path.basename(x)), async update => {
            const updateFunc = require(update).update as UpdateFunction;
            await updateFunc(mongoStore, logger.child({ component: 'UPDATE ' + path.basename(update) }));
            await serverConfigRepository.updateProcessedAsync(path.basename(update));
        });
    } finally {
        await serverConfigRepository.setUpdateInProcessAsync(false);
    }
}

export class ServerConfig extends Typegoose {
    @prop({ required: true })
    active: boolean;

    @readonly()
    @prop({ required: true })
    processedUpdates: string[];

    @readonly()
    @prop({ required: true })
    seeded: boolean;

    @readonly()
    @prop({ required: true })
    inProcess: boolean;
}

export type ServerConfigRepository = {
    getServerConfigAsync: () => Promise<ServerConfig>;
    updateProcessedAsync: (updateName: string) => Promise<void>;
    seedProcessedAsync: () => Promise<void>;
    setUpdateInProcessAsync: (inProcess: boolean) => Promise<void>;
    isUpdateInProcessAsync: () => Promise<boolean>;
};

export function createServerConfigRepository(store: Store): ServerConfigRepository {
    return {
        getServerConfigAsync: async () => {
            const serverConfig = await store.models.serverConfig.findOne({ active: true });
            return serverConfig;
        },
        updateProcessedAsync: async (updateName: string) => {
            const result = await store.models.serverConfig.updateOne(
                { active: true },
                {
                    $push: { processedUpdates: updateName },
                },
                {
                    upsert: false,
                }
            );
            if (result.ok !== 1) {
                throw Error(COULD_NOT_WRITE_TO_SERVER);
            }
        },
        seedProcessedAsync: async () => {
            const result = await store.models.serverConfig.updateOne(
                { active: true },
                {
                    $set: { seeded: true },
                },
                {
                    upsert: false,
                }
            );
            if (result.ok !== 1) {
                throw Error(COULD_NOT_WRITE_TO_SERVER);
            }
        },
        setUpdateInProcessAsync: async (inProcess: boolean) => {
            const result = await store.models.serverConfig.updateOne(
                { active: true },
                {
                    $set: { inProcess: inProcess },
                },
                {
                    upsert: false,
                }
            );
            if (result.ok !== 1) {
                throw Error(COULD_NOT_WRITE_TO_SERVER);
            }
        },
        isUpdateInProcessAsync: async () => {
            const result: ServerConfig = await store.models.serverConfig.findOne({ active: true });

            return result ? result.inProcess : false;
        },
    };
}
