import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as bluePromise from 'bluebird';
import * as helmet from 'helmet';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as csrf from 'csurf';

import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';

import { initGraphQLSchema } from './schema';
import { createMetadataController } from './controller';

const BASE_URL = '/chestnut';
const WS_GQL_PATH = '/subscriptions';
(<any>mongoose).Promise = bluePromise;

export type ChestnutOptions = {
    port: number;
    models: any;
    mongoDb: string;
    modelPrefix?: string;
    publicFolder?: string;
    sessionSecret: string;
};

export type Chestnut = {
    expressApp: any;
    models: any;
};

export async function initChestnut(
    options: ChestnutOptions,
    initMiddleware?: (app) => Promise<void>
): Promise<Chestnut> {
    const app = express();

    app.use(helmet());

    app.use(express.static(options.publicFolder || 'public'));
    app.use(BASE_URL + '/admin', express.static(__dirname + '../../client/dist'));

    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(csrf({ cookie: true }));

    if (initMiddleware) await initMiddleware(app);

    app.use(BASE_URL, (req, res, next) => {
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

    // session stuff after static middleware
    app.set('trust proxy', 1); // trust first proxy
    app.use(
        session({
            secret: options.sessionSecret,
            name: 'chestnut.sessionId',
        })
    );

    const { schema, models } = initGraphQLSchema(options.models, connection, options.modelPrefix);

    createMetadataController(app, options.models, BASE_URL);

    app.use(`${BASE_URL}/graphql`, graphqlExpress({ schema }));
    app.get(`${BASE_URL}/graphiql`, graphiqlExpress({ endpointURL: '/graphql' }));

    app.listen(options.port, () => console.log(`chestnut-server listening on port ${options.port}`));

    return { expressApp: app, models: models };
}
