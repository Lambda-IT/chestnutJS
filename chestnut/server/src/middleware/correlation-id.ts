import { Response, NextFunction } from 'express';
import * as uuidV4 from 'uuid/v4';

export type Correlation =  {
    correlationId: string;
}

export function correlationId(request: any, _: Response, next: NextFunction) {
    // TODO: check header or body for correlationId and set it to the property
    request.correlationId = uuidV4();
    return next();
}
