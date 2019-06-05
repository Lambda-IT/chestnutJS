import * as DecodeTypes from 'decode-ts/target/types';
import { none, Option, some } from 'fp-ts/lib/Option';
import { ValidationError } from 'io-ts';
import { ofType, unionize } from 'unionize';
import { updateOrAppend } from '@core/fp-ts-helpers';

export interface RemoteData<E, A> {
    loading: boolean;
    data: Option<A>;
    error: Option<E>;
}

export const initial: RemoteData<never, never> = { loading: false, data: none, error: none };
export const loading: RemoteData<never, never> = { loading: true, data: none, error: none };
export const failure = <E>(error: E): RemoteData<E, never> => ({ loading: false, data: none, error: some(error) });
export const success = <A>(data: A): RemoteData<never, A> => ({ loading: false, data: some(data), error: none });

export const mapData = <E, A, B>(f: (data: A) => B) => (remoteData: RemoteData<E, A>): RemoteData<E, B> => ({
    ...remoteData,
    data: remoteData.data.map(f),
});

export const mapError = <E, F, A>(f: (error: E) => F) => (remoteData: RemoteData<E, A>): RemoteData<F, A> => ({
    ...remoteData,
    error: remoteData.error.map(f),
});

export const isLoadingOrHasData = <E, A>(rd: RemoteData<E, A>) => rd.loading || rd.data.isSome();

export interface ChestnutAPIErrorResponse {
    status: number;
    statusText: string;
    error: any;
}

export const RemoteDataError = unionize(
    {
        JavaScriptError: ofType<{ error: Error }>(),
        APIErrorResponse: ofType<{ apiErrorResponse: ChestnutAPIErrorResponse }>(),
        PayloadDecodeError: ofType<{ validationErrors: ValidationError[] }>(),
        DecodeError: ofType<{ decodeError: DecodeTypes.JsonDecodeError }>(),
    },
    'tag',
    'value'
);
export type RemoteDataError = typeof RemoteDataError._Union;

export type ChestnutRemoteData<A> = RemoteData<RemoteDataError, A>;

export interface ChestnutRemoteDataStamped<S, A> {
    stamp: S;
    remoteData: ChestnutRemoteData<A>;
}
export const chestnutRemoteDataStamped = <S, A>(stamp: S) => (remoteData: ChestnutRemoteData<A>) => ({
    stamp,
    remoteData,
});
export type ChestnutRemoteDataStampedArray<S, A> = ChestnutRemoteDataStamped<S, A>[];
export const updateOrAppendStamped = <S, A>(
    as: ChestnutRemoteDataStampedArray<S, A>,
    a: ChestnutRemoteDataStamped<S, A>
) => updateOrAppend(as, a, b => b.stamp === a.stamp);
