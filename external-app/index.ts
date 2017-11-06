import { Chestnut, ChestnutOptions, initChestnut } from '../chestnut';
import * as models from './model/models';

const PORT = +(process.env.PORT || 9000);

initChestnut({ port: PORT, models: models, mongoDb: 'mongodb://localhost:27017/external-app' }).then(() =>
    console.log('started')
);
