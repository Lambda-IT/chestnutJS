import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { initGraphQLSchema } from './app/schema';
const WS_GQL_PATH = '/subscriptions';

export type ChestnutOptions = {
    port: number;
    models: any;
    dbConnection: string;
};

export type Chestnut = {
    expressApp: any;
};

export function initChestnut(options: ChestnutOptions): Chestnut {
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

    mongoose.connect(options.dbConnection);
    const schema = initGraphQLSchema(options.models);
    app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
    app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

    app.listen(options.port, () => console.log(`simple-todos-server listening on port ${options.port}`));

    return { expressApp: app };
}
