import { MetadataInDto } from './catalog.effect';
import { Option, none, some } from 'fp-ts/lib/Option';
import { ReducerBuilder } from '@shared/ngx-tools/reducer-builder';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Either } from 'fp-ts/lib/Either';
import unionize, { ofType } from 'unionize';
import { JsonDecodeError } from 'decode-ts';

export interface CatalogPageState {
    model: Option<MetadataInDto>;
    loaded: boolean;
    loading: boolean;
    error: Option<ErrorType>;
}

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

export class CatalogDataLoaded {
    readonly type = 'CATALOG_DATA_LOADED';
    constructor(public payload: Either<ErrorType, MetadataInDto>) { }
}

export class CatalogDataLoading {
    readonly type = 'CATALOG_DATA_LOADING';
}

export const reducer = new ReducerBuilder<CatalogPageState>()
    .handle(CatalogDataLoading, (state) => ({ ...state, loading: true }))
    .handle(CatalogDataLoaded, (state, action) => ({ ...state, ...action.payload.fold<CatalogPageState>(
        l => ({ loaded: false, loading: false, error: some(l), model: none }),
        r => ({ loaded: true, loading: true, model: some(r), error: none })
    )}))
    .build({
        model: none,
        loaded: false, // indicate that data are ready
        loading: false, // indicate Loading
        error: none
    });

export const getCatalogState = createFeatureSelector<CatalogPageState>('catalog');
export const catalogSelectors = {
    getCatalogModel: createSelector(getCatalogState, state => state.model),
    isLoading: createSelector(getCatalogState, state => state.loading)
};
