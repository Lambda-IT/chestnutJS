import unionize, { ofType } from 'unionize';

// import { HttpApiError } from '../http-utils';
import { RemoteDataError } from '../remote-data';

export const GlobalAction = unionize(
    {
        globalRemoteDataError: ofType<RemoteDataError>(),
        // globalHttpApiError: ofType<HttpApiError>(),
        globalClearError: ofType<null>(),
    },
    'type',
    'payload'
);
export type GlobalAction = typeof GlobalAction._Union;
