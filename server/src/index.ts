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
import * as _fs from 'fs';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import * as urljoin from 'url-join';

import { Log } from '../typings/log';
import { createLogger } from './logger';
import { createStoreAsync, Store, COULD_NOT_WRITE_TO_SERVER } from './store';
import { initGraphQLSchema } from './schema';
import { createMetadataController } from './controller';
import { correlationId, registerGlobalExceptionHandler, resultProcessor } from './middleware';
import { createApi } from './api/model-api';
import { createAuth } from './auth/auth-api';
import { createAuthorizationHandler } from './auth/token-validation';
import { ChestnutUser } from './chestnut-user-type';
import { createAuthUserRepository } from './auth/repositories';
import { Server } from 'http';
import { updateServer, createServerConfigRepository, ServerConfig } from './server-update-service';
import { createFileUploadController } from './controller/file-service';

export const BASE_URL = '/chestnut';
const fs = <any>bluePromise.promisifyAll(_fs);

export { UpdateFunction } from './server-update-service';
export { Store } from './store';
export { Log } from '../typings/log';

const WS_GQL_PATH = '/subscriptions';
(<any>mongoose).Promise = bluePromise;
const MongoStore = connectMongo(session);

export type ChestnutOptions = {
    port: number;
    models: { [name: string]: any }; // Typegoose Models
    mongoDb: string;
    modelName?: {
        prefix?: string;
        pluralize?: true;
        kebabCase?: true;
    };
    publicFolder?: string;
    sessionSecret: string;
    apiUrl: string;
    updatesFolder?: string;
    cors?: any;
    bodyParser?: {
        json?: any;
        urlencoded?: any;
    };
};

export type Chestnut = {
    expressApp: express.Express;
    store: Store;
    logger: Log;
    server: Server;
};

async function replaceApiUrl(adminAppPath: string, apiUrl: string) {
    try {
        const buf: Buffer = await fs.readFileAsync(path.join(adminAppPath, 'index.html'));
        let html = buf.toString();
        // tslint:disable-next-line:quotemark
        html = html.replace(/(window\.__apiBaseUrl = \')([^\']+)\';/gi, '$1' + urljoin(apiUrl, 'chestnut') + "';");
        // tslint:disable-next-line:quotemark
        html = html.replace(/(window\.__identityBaseUrl = \')([^\']+)\';/gi, '$1' + urljoin(apiUrl, 'auth') + "';");

        // console.log('html', html);

        await fs.writeFileAsync(path.join(adminAppPath, 'index.html'), html);
    } catch (e) {
        console.error('replaceApiUrl failed' + e);
    }
}

export async function initChestnut(
    options: ChestnutOptions,
    initMiddleware?: (app: express.Express, store: Store, logger: Log) => Promise<void>,
    app: express.Express = express()
): Promise<Chestnut> {
    const logger = createLogger();
    registerGlobalExceptionHandler(logger);

    app.use(helmet());

    app.use(correlationId);
    app.use(resultProcessor);

    app.use(express.static(options.publicFolder || 'public'));
    let adminAppPath = path.join(__dirname, '../../client');

    if (options.apiUrl.indexOf('localhost') > 0) adminAppPath = path.join(adminAppPath, 'dist', 'client');

    await replaceApiUrl(adminAppPath, options.apiUrl);

    app.use(BASE_URL + '/admin', express.static(adminAppPath, { fallthrough: true }), (req, res, next) => {
        logger.warn('not found', { path: req.path, query: req.query, params: req.params, headers: req.headers });
        if (req.path !== '/') return res.redirect(BASE_URL + '/admin');
        res.sendStatus(404);
    });

    console.log('static app', { BASE_URL, adminAppPath });

    // Allow cors on all routes
    app.use(
        cors({
            exposedHeaders: ['Location'],
            ...(options.cors || {}),
        })
    );

    options.bodyParser = options.bodyParser || {};

    app.use(bodyParser.urlencoded({ extended: true, ...(options.bodyParser.urlencoded || {}) }));
    app.use(bodyParser.json({ ...(options.bodyParser.json || {}) }));
    app.use(cookieParser());

    app.use(BASE_URL, (req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
        if (req.method === 'OPTIONS') {
            res.sendStatus(200);
        } else {
            next();
        }
    });

    const store = await createStoreAsync(options, {
        // useMongoClient: true,
        /* other options */
        // useNewUrlParser: true,
    });

    const serverConfigRepository = createServerConfigRepository(store);
    let serverConfig = await serverConfigRepository.getServerConfigAsync();

    if (!serverConfig) {
        serverConfig = await store.models.serverConfig.create({
            active: true,
            processedUpdates: [],
            seeded: false,
            inProcess: false,
        } as ServerConfig);

        if (!serverConfig) {
            throw Error(COULD_NOT_WRITE_TO_SERVER);
        }
    }

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
    // createApi(authHandler, app, store, logger);

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

    const schema = initGraphQLSchema(store, options);
    createMetadataController(app, store, BASE_URL);
    createFileUploadController(app, store, BASE_URL);

    app.use(`${BASE_URL}/graphql`, authHandler.ensureAuthorized, graphqlExpress({ schema })); // authHandler.ensureAuthorized,
    app.get(`${BASE_URL}/graphiql`, graphiqlExpress({ endpointURL: `${BASE_URL}/graphql` }));

    app.use('^((?!chestnut).)*$', csrf({ cookie: false }));
    app.use('^((?!chestnut).)*$', (req: any, res, next) => {
        res.locals.csrfToken = req.csrfToken();
        next();
    });

    if (options.updatesFolder) {
        logger.info('running updates', { updatesFolder: options.updatesFolder });
        const availableUpdates = (await fs.readdirAsync(options.updatesFolder)) as string[];

        await updateServer(
            store,
            serverConfig,
            availableUpdates.map(u => path.join(options.updatesFolder, u)),
            serverConfigRepository,
            logger
        );
    }

    if (initMiddleware) await initMiddleware(app, store, logger);

    logger.info('server initialized successfull');

    const server = await app.listen(options.port);

    logger.info(`chestnut-server listening on port ${options.port}`);

    process.on('SIGINT', () => {
        logger.info('shutdown signal received.');

        // Stops the server from accepting new connections and finishes existing connections.
        store.connection.close(() => {
            logger.info('MongoDB connection disconnected');
            process.exit(0);
        });
    });

    return { expressApp: app, store: store, logger: logger, server };
}

export async function createUserAsync(store: Store, user: ChestnutUser) {
    return createAuthUserRepository(store).createUser(user);
}
