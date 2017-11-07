import { Chestnut } from '../';
import { createHomeController } from './controllers';

export function createControllers(server: Chestnut) {
    createHomeController(server);
}
