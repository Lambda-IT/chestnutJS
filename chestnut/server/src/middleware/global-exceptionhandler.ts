import * as process from 'process';
import { Log } from '../../typings/log';

export function registerGlobalExceptionHandler(log: Log) {
    process.on('uncaughtException', function(err) {
        log.error(new Date().toUTCString() + ' uncaughtException:', err.message);
        log.error(err.stack);
        process.exit(1);
    });
}
