import { Chestnut, ChestnutOptions, initChestnut } from '../chestnut';
import * as models from './model/models';

const PORT = +(process.env.PORT || 9000);
let server;
initChestnut({
    port: PORT,
    models: models,
    mongoDb: 'mongodb://localhost:27017/external-app',
    sessionSecret: '___feifji$gö$gsdfgprüi45u834u584wtti',
    modelPrefix: 'dev',
})
    .then(s => {
        server = s;
        server.logger.info('started');
    })
    .catch(
        e =>
            server && server.logger
                ? server.logger.error('error starting server', e)
                : console.error('error starting server', e)
    );
