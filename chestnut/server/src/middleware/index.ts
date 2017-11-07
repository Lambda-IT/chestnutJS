import { ResultProcessor } from './result-processor';
import { Request, Response } from 'express';
import { Correlation } from './correlation-id';

export * from './correlation-id';
export * from './result-processor';
export * from './global-exceptionhandler';
export type Request = Request & Correlation;
export type Response = Response & ResultProcessor;
