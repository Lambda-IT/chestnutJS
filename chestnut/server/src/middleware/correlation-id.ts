import { Response, NextFunction } from 'express';
import * as uuidV4 from 'uuid/v4';

export type Correlation = {
    correlationId: string;
};

export function correlationId(request: any, _: Response, next: NextFunction) {
    let correlationId = request.header('correlationId');
    if (!correlationId) {
        correlationId = uuidV4();
    }
    request.correlationId = correlationId;
    return next();
}
