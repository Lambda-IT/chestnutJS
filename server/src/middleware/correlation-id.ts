import { Response, NextFunction } from 'express';
import * as uuidV4 from 'uuid/v4';

export type Correlation = {
    correlationId: string;
};

export function correlationId(request: any, _: Response, next: NextFunction) {
    let correlId = request.header('correlationId');
    if (!correlId) {
        correlId = uuidV4();
    }
    request.correlationId = correlId;
    return next();
}
