import * as models from './models/models';
import * as path from 'path';
import { initChestnut } from '../';

const PORT = +(process.env.PORT || 9000);
let server;

initChestnut(
    {
        port: PORT,
        models: models,
        mongoDb: 'mongodb://localhost:27017/external-app',
        sessionSecret: '___feifji$gö$gsdfgprüi45u834u584wtti',
        modelName: { prefix: 'dev', kebabCase: true },
        apiUrl: 'http://localhost:9000',
        clientPath: '../../client',
        updatesFolder: path.join(__dirname, '../external/updates'),
    },
    _ => Promise.resolve()
)
    .then(s => {
        server = s;
        server.logger.info('started');
    })
    .catch(e =>
        server && server.logger
            ? server.logger.error('error starting server', e)
            : console.error('error starting server', e)
    );
