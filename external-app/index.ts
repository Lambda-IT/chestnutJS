import { Chestnut, ChestnutOptions, initChestnut } from '../';
import * as models from './models/models';
import { createControllers } from './views';
import * as pug from 'pug';

export { Chestnut, Response, Request } from '../';

const PORT = +(process.env.PORT || 9000);
let server;

async function initMiddleware(app) {
    app.engine('pug', pug.__express);
    app.set('views', './templates/views');
    app.set('view engine', 'pug');

    app.use((err, req, res, next) => {
        server.logger.error(err, 'request');

        if (err.code !== 'EBADCSRFTOKEN') return next(err);

        // handle CSRF token errors here
        res.status(403);
        res.send('form tampered with');
    });

    app.use((req, res, next) => {
        const log: any = {
            body: req.body,
            method: req.method,
            ip: req.ip,
            correlationId: req.correlationId,
        };

        server.logger.info(log, 'request');
        next();
    });

    console.log('initMiddleware finished');
}

initChestnut(
    {
        port: PORT,
        models: models,
        mongoDb: 'mongodb://localhost:27017/external-app',
        sessionSecret: '___feifji$gö$gsdfgprüi45u834u584wtti',
        modelPrefix: 'dev',
    },
    initMiddleware,
)
    .then(s => {
        server = s;
        server.logger.info('started');

        createControllers(s);
    })
    .catch(
        e =>
            server && server.logger
                ? server.logger.error('error starting server', e)
                : console.error('error starting server', e),
    );
