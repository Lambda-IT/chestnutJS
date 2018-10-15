import { NextFunction } from 'express';

export type ResultProcessor = {
    created(): void;
    createdResult(result: any): void;
    error(error: any): void;
    badRequest(error: Error);
    ok();
    sendResult(result: any);
    writeLocation(location: string);
    notFound();
    notAuthorized();
};

export function resultProcessor(_: any, response: any, next: NextFunction) {
    response.ok = () => response.status(200);
    response.sendResult = (result: any) => response.status(200).json(result);
    response.created = () => response.status(201);
    response.createdResult = (result: any) => response.status(201).json(result);
    response.error = (result: string) => response.status(500).send(result);
    response.badRequest = (result: Error) => response.status(400).json(result);
    response.writeLocation = (location: string) => response.location(location);
    response.notFound = () => response.status(404);
    response.notAuthorized = () => response.status(401).send('NOT_AUTHORIZED');
    return next();
}
