import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as bluePromise from 'bluebird';

import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';

import { initGraphQLSchema } from './schema';
import { createMetadataController } from './controller';

const WS_GQL_PATH = '/subscriptions';
(<any>mongoose).Promise = bluePromise;

export type ChestnutOptions = {
    port: number;
    models: any;
    mongoDb: string;
};

export type Chestnut = {
    expressApp: any;
    models: any;
};

export async function initChestnut(options: ChestnutOptions): Promise<Chestnut> {
    const app = express();

    app.use('/graphql', function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
        if (req.method === 'OPTIONS') {
            res.sendStatus(200);
        } else {
            next();
        }
    });

    const connection = await mongoose.createConnection(options.mongoDb, {
        useMongoClient: true,
        /* other options */
    });

    const { schema, models } = initGraphQLSchema(options.models, connection);

    createMetadataController(app, options.models);

    app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
    app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

    app.listen(options.port, () => console.log(`chestnut-server listening on port ${options.port}`));

    return { expressApp: app, models: models };
}
