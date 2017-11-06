import { Chestnut, ChestnutOptions, initChestnut } from '../chestnut';
import * as models from './model/models';

const PORT = +(process.env.PORT || 9000);
const dbConnection = 'mongodb://localhost:27017/chestnut';
const server = initChestnut({ port: PORT, models: models, dbConnection: dbConnection });
