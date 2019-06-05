import { Action } from '@ngrx/store';
import { concat, Observable, of } from 'rxjs';
import { mergeMap, shareReplay } from 'rxjs/operators';

import * as either from 'fp-ts/lib/Either';
import Either = either.Either;

import { GlobalAction } from '../global-action';
import { fromFilteredLeft, fromFilteredRight } from '../rx-helpers';
import { Option } from 'fp-ts/lib/Option';
import { ChestnutRemoteData, failure, loading, RemoteDataError, success } from '@core/remote-data';

export type RemoteDataErrorGlobalHandler = (e: RemoteDataError) => Action[];

export interface RemoteData<E, A> {
    loading: boolean;
    data: Option<A>;
    error: Option<E>;
}

export interface RemoteDataCallOptions {
    preLoadingActions?: Action[];
    postLoadingActions?: Action[];
    remoteDataErrorGlobalHandler?: RemoteDataErrorGlobalHandler;
}

export const defaultRemoteDataErrorGlobalHandler: RemoteDataErrorGlobalHandler = e => [
    GlobalAction.globalRemoteDataError(e),
];

const getRemoteDataCallOptionsWithDefaults = (options: RemoteDataCallOptions) => ({
    preLoadingActions: options.preLoadingActions || [],
    postLoadingActions: options.postLoadingActions || [],
    remoteDataErrorGlobalHandler: options.remoteDataErrorGlobalHandler || defaultRemoteDataErrorGlobalHandler,
});

export function makeRemoteDataCall<T>(
    serviceCall: Observable<Either<RemoteDataError, T>>,
    actionCreator: (v: ChestnutRemoteData<T>) => Action,
    options: RemoteDataCallOptions = {}
) {
    const {
        preLoadingActions,
        postLoadingActions,
        remoteDataErrorGlobalHandler,
    } = getRemoteDataCallOptionsWithDefaults(options);

    return concat(
        [...preLoadingActions, actionCreator(loading), ...postLoadingActions],
        serviceCall.pipe(
            mergeMap(x => [
                actionCreator(x.fold<ChestnutRemoteData<T>>(failure, success)),
                ...x.fold(remoteDataErrorGlobalHandler, () => []),
            ])
        )
    );
}

export function makeRemoteDataCallTransform<T, U>(
    serviceCall: Observable<Either<RemoteDataError, T>>,
    project: (v: ChestnutRemoteData<T>) => U,
    actionCreator: (v: U) => Action,
    options: RemoteDataCallOptions = {}
) {
    const {
        preLoadingActions,
        postLoadingActions,
        remoteDataErrorGlobalHandler,
    } = getRemoteDataCallOptionsWithDefaults(options);

    return concat(
        [...preLoadingActions, actionCreator(project(loading)), ...postLoadingActions],
        serviceCall.pipe(
            mergeMap(x => [
                actionCreator(project(x.fold<ChestnutRemoteData<T>>(failure, success))),
                ...x.fold(remoteDataErrorGlobalHandler, () => []),
            ])
        )
    );
}

export function makeRemoteDataCallChain<T>(
    serviceCall: Observable<Either<RemoteDataError, T>>,
    actionCreator: (v: ChestnutRemoteData<T>) => Action,
    options: RemoteDataCallOptions = {}
) {
    const {
        preLoadingActions,
        postLoadingActions,
        remoteDataErrorGlobalHandler,
    } = getRemoteDataCallOptionsWithDefaults(options);

    const serviceCall$ = serviceCall.pipe(shareReplay(1));
    const data$ = serviceCall$.pipe(fromFilteredRight());
    const error$ = serviceCall$.pipe(fromFilteredLeft());

    const actionStream$ = concat(
        [...preLoadingActions, actionCreator(loading), ...postLoadingActions],
        serviceCall$.pipe(
            mergeMap(x => [
                actionCreator(x.fold<ChestnutRemoteData<T>>(failure, success)),
                ...x.fold(remoteDataErrorGlobalHandler, () => []),
            ])
        )
    );

    return of({
        data$,
        error$,
        actionStream$,
    });
}

export function makeRemoteDataCallTransformChain<T, U>(
    serviceCall: Observable<Either<RemoteDataError, T>>,
    project: (v: ChestnutRemoteData<T>) => U,
    actionCreator: (v: U) => Action,
    options: RemoteDataCallOptions = {}
) {
    const {
        preLoadingActions,
        postLoadingActions,
        remoteDataErrorGlobalHandler,
    } = getRemoteDataCallOptionsWithDefaults(options);

    const serviceCall$ = serviceCall.pipe(shareReplay(1));
    const data$ = serviceCall$.pipe(fromFilteredRight());
    const error$ = serviceCall$.pipe(fromFilteredLeft());

    const actionStream$ = concat(
        [...preLoadingActions, actionCreator(project(loading)), ...postLoadingActions],
        serviceCall$.pipe(
            mergeMap(x => [
                actionCreator(project(x.fold<ChestnutRemoteData<T>>(failure, success))),
                ...x.fold(remoteDataErrorGlobalHandler, () => []),
            ])
        )
    );

    return of({
        data$,
        error$,
        actionStream$,
    });
}
