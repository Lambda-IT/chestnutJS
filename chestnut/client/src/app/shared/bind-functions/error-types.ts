import unionize, { ofType } from 'unionize';
import { JsonDecodeError } from 'decode-ts';

export interface APIErrorResponse {
    status: number;
    statusText: string;
    error: any;
}

export const ErrorType = unionize(
    {
        APIErrorResponse: ofType<{ apiErrorResponse: APIErrorResponse }>(),
        DecodeError: ofType<{ decodeError: JsonDecodeError }>(),
    },
    'tag',
    'value'
);
export type ErrorType = typeof ErrorType._Union;
