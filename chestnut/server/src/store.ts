import * as mongoose from 'mongoose';
import * as kebabCase from 'kebab-case';
import * as camelcase from 'camelcase';
import { AuthUser, AuthClient, AuthToken } from './auth/models';

export const connectionStringRegex = /mongodb:\/\/(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])\:\d{5}\/\w+/i;

function getOptions(options, modelName, prefix) {
    const result = Object.assign({}, options);
    if (prefix) result.schemaOptions = { collection: `${prefix}_${modelName}s` };
    return result;
}

export interface Store {
    connection: mongoose.Connection;
    models: {
        [name: string]: mongoose.Model<any>;
    };
}

export async function createStoreAsync(
    models: { [name: string]: any },
    connectionString: string,
    connectionOptions?: mongoose.ConnectionOptions,
    modelPrefix?: string
): Promise<Store> {
    if (!connectionStringRegex.test(connectionString)) {
        throw new Error(`${connectionString}: is not a valid connectionString`);
    }

    let connection = await mongoose.createConnection(connectionString, connectionOptions);

    const options: any = { existingConnection: connection };

    let database = {
        connection: connection,
        models: {
            authUser: new AuthUser().getModelForClass(AuthUser, getOptions(options, 'auth-user', modelPrefix)),
            authClient: new AuthClient().getModelForClass(AuthClient, getOptions(options, 'auth-client', modelPrefix)),
            authToken: new AuthToken().getModelForClass(AuthToken, getOptions(options, 'auth-token', modelPrefix)),
        },
    };

    Object.keys(models).forEach(key => {
        const modelName = camelcase(key);
        const model = models[key];
        database.models[modelName] = new model().getModelForClass(
            model,
            getOptions(options, kebabCase(modelName), modelPrefix)
        );
    });

    // database.pinboard.createIndex({ lastModified: -1 });
    // database.pinboard.createIndex({ id: 1, validUntil: 1, owner: 1 });
    // database.assetStats.createIndex({ assetId: 1 }, { unique: true });
    // database.assets.createIndex({ imageHash: 1 });

    return database;
}
