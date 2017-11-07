import { Log } from '../typings/log';
import * as bunyan from 'bunyan';

let log;
export function createLogger(configuration?: any): Log {
    if (!!log) return log;

    const streams: any[] = [
        {
            level: 'info',
            stream: process.stdout,
        },
    ];

    // if (configuration.host)
    //     streams.push({
    //         level: 'debug',
    //         type: 'raw',
    //         stream: bunyantcp.createStream(configuration),
    //     });

    configuration = configuration || { name: 'chestnut', level: 'debug' };

    log = bunyan.createLogger({
        name: configuration.name,
        streams: streams,
        level: configuration.level,
    });

    return log;
}
