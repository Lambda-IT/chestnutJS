import * as mongoose from 'mongoose';
import * as kebabCase from 'kebab-case';
import * as camelcase from 'camelcase';
import { AuthUser, AuthClient, AuthToken } from './auth/models';
import { ChestnutOptions } from '.';

export const connectionStringRegex = /mongodb:\/\/(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])\:\d{5}\/\w+/i;

function getOptions(options, modelName, chestnutOptions: ChestnutOptions) {
    const result = Object.assign({}, options);
    result.schemaOptions = {
        collection: modelName,
    };
    if (chestnutOptions.modelName) {
        const { prefix, pluralize } = chestnutOptions.modelName;
        result.schemaOptions.collection = `${prefix ? `${prefix}_` : ''}${modelName}${pluralize ? 's' : ''}`;
    }
    return result;
}

export function modifyCaseOfModelName(modelName, options: ChestnutOptions) {
    if (!options.modelName || !options.modelName.kebabCase) {
        return modelName;
    }
    return kebabCase(modelName);
}

export interface Store {
    connection: mongoose.Connection;
    models: {
        [name: string]: mongoose.Model<any>;
    };
}

export async function createStoreAsync(
    options: ChestnutOptions,
    connectionOptions?: mongoose.ConnectionOptions
): Promise<Store> {
    const { mongoDb, models } = options;

    if (!connectionStringRegex.test(mongoDb)) {
        throw new Error(`${mongoDb}: is not a valid connectionString`);
    }

    let connection = await mongoose.createConnection(mongoDb, connectionOptions);

    const parameters: any = { existingConnection: connection };

    let database = {
        connection: connection,
        models: {
            authUser: new AuthUser().getModelForClass(AuthUser, getOptions(parameters, 'auth-user', options)),
            authClient: new AuthClient().getModelForClass(AuthClient, getOptions(parameters, 'auth-client', options)),
            authToken: new AuthToken().getModelForClass(AuthToken, getOptions(parameters, 'auth-token', options)),
        },
    };

    Object.keys(models).forEach(key => {
        // Typegoose models
        const modelName = camelcase(key);
        const model = models[key];
        // returns the corresponding Mongoose Model
        database.models[modelName] = new model().getModelForClass(
            model,
            getOptions(parameters, modifyCaseOfModelName(key, options), options)
        );
    });

    // database.pinboard.createIndex({ lastModified: -1 });
    // database.pinboard.createIndex({ id: 1, validUntil: 1, owner: 1 });
    // database.assetStats.createIndex({ assetId: 1 }, { unique: true });
    // database.assets.createIndex({ imageHash: 1 });

    return database;
}
