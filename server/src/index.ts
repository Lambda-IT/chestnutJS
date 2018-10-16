import * as express from 'express';
import * as cors from 'cors';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as bluePromise from 'bluebird';
import * as helmet from 'helmet';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as csrf from 'csurf';
import * as connectMongo from 'connect-mongo';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';

import { Log } from '../typings/log';
import { createLogger } from './logger';
import { createStoreAsync, Store } from './store';
import { initGraphQLSchema } from './schema';
import { createMetadataController } from './controller';
import { correlationId, registerGlobalExceptionHandler, resultProcessor } from './middleware';
import { createApi } from './api/model-api';
import { createAuth } from './auth/auth-api';
import { createAuthorizationHandler } from './auth/token-validation';
import { ChestnutUser } from './chestnut-user-type';
import { createAuthUserRepository } from './auth/repositories';

export const BASE_URL = '/chestnut';

const WS_GQL_PATH = '/subscriptions';
(<any>mongoose).Promise = bluePromise;
const MongoStore = connectMongo(session);

export type ChestnutOptions = {
    port: number;
    models: { [name: string]: any }; // Typegoose Models
    mongoDb: string;
    modelPrefix?: string;
    publicFolder?: string;
    sessionSecret: string;
    apiUrl: string;
};

export type Chestnut = {
    expressApp: express.Express;
    store: Store;
    logger: Log;
};

export async function initChestnut(
    options: ChestnutOptions,
    initMiddleware?: (app) => Promise<void>
): Promise<Chestnut> {
    const logger = createLogger();
    registerGlobalExceptionHandler(logger);

    const app = express();

    app.use(helmet());

    app.use(correlationId);
    app.use(resultProcessor);

    app.use(express.static(options.publicFolder || 'public'));
    const adminAppPath = path.join(__dirname, '../../client/dist/client');
    app.use(BASE_URL + '/admin', express.static(adminAppPath));

    console.log('static app', { BASE_URL, adminAppPath });

    // Allow cors on all routes
    app.use(
        cors({
            exposedHeaders: ['Location'],
        })
    );

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cookieParser());

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

    const store = await createStoreAsync(
        options.models,
        options.mongoDb,
        {
            // useMongoClient: true,
            /* other options */
            // useNewUrlParser: true,
        },
        options.modelPrefix
    );

    const authConfiguration = {
        issuer: options.apiUrl,
        secretKey: '5rzz289v303zg',
        tokenExpiration: 3600,
        refreshTokenExpiration: 86400,
        maxFailedLoginAttempts: 3,
        waitTimeToUnlockUser: 5,
    };
    const identity = createAuth(authConfiguration, app, store, logger);
    const authHandler = createAuthorizationHandler(identity, authConfiguration);
    createApi(authHandler, app, store, logger);

    // session stuff after static middleware
    app.set('trust proxy', 1); // trust first proxy
    app.use(
        session({
            secret: options.sessionSecret,
            name: 'chestnut.sessionId',
            resave: false,
            saveUninitialized: false,
            store: new MongoStore({ mongooseConnection: store.connection }),
        })
    );

    const schema = initGraphQLSchema(store, options.modelPrefix);
    createMetadataController(app, store, BASE_URL);

    app.use(`${BASE_URL}/graphql`, authHandler.ensureAuthorized, graphqlExpress({ schema }));
    app.get(`${BASE_URL}/graphiql`, graphiqlExpress({ endpointURL: `${BASE_URL}/graphql` }));

    app.use(csrf({ cookie: false }));
    app.use((req: any, res, next) => {
        res.locals.csrfToken = req.csrfToken();
        next();
    });

    await app.listen(options.port);

    logger.info(`chestnut-server listening on port ${options.port}`);

    return { expressApp: app, store: store, logger: logger };
}

export async function createUserAsync(store: Store, user: ChestnutUser) {
    return createAuthUserRepository(store).createUser(user);
}
