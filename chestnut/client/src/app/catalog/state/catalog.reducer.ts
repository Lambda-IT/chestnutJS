import { Option, none, some } from 'fp-ts/lib/Option';
import { ReducerBuilder } from 'ngrx-reducer-builder';
import { createFeatureSelector, createSelector, Action } from '@ngrx/store';
import { ErrorType } from '@shared/bind-functions';
import { MetadataLoading, MetadataLoaded, MetadataDto } from '@shared/actions';
import { Either } from 'fp-ts/lib/Either';

export interface CatalogModel {
    name: string;
    count: number;
}

export interface CatalogPageState {
    model: Option<CatalogModel[]>;
    loaded: boolean;
    loading: boolean;
    error: Option<ErrorType>;
}

export class CountQueryExecuted {
    readonly type = 'COUNT_QUERY_EXECUTED';
    constructor(public payload: { modelName: string; count: number }) {}
}

export class AllCountQueriesExecuted {
    readonly type = 'ALL_COUNT_QUERIES_EXECUTED';
    constructor() {}
}

const reducer = new ReducerBuilder<CatalogPageState>()
    .handle(MetadataLoading, state => ({ ...state, loading: true }))
    .handle(MetadataLoaded, (state, action) => ({
        ...state,
        ...transformMetadata(action.payload),
    }))
    .handle(CountQueryExecuted, (state, action) => ({
        ...state,
        model: state.model.map(x => [
            ...x
                .filter(f => f.name === action.payload.modelName)
                .map(c => ({ name: c.name, count: action.payload.count })),
            ...x.filter(f => f.name !== action.payload.modelName),
        ]),
    }))
    .handle(AllCountQueriesExecuted, (state, action) => ({
        ...state,
        loaded: true,
        loading: false,
    }))
    .build({
        model: none,
        loaded: false, // indicate that data are ready
        loading: false, // indicate Loading
        error: none,
    });

export const getCatalogState = createFeatureSelector<CatalogPageState>('catalog');
export const catalogSelectors = {
    getCatalogModel: createSelector(getCatalogState, state => state.model),
    isLoading: createSelector(getCatalogState, state => state.loading),
};

const transformMetadata = (metadata: Either<ErrorType, MetadataDto>) =>
    metadata.fold<CatalogPageState>(
        l => ({ loaded: false, loading: false, error: some(l), model: none }),
        r => ({
            loaded: true,
            loading: false,
            model: some(r.models.map(p => <CatalogModel>{ name: p.name })),
            error: none,
        })
    );

export function catalogReducer(state: CatalogPageState, action: Action): CatalogPageState {
    return reducer(state, action);
}
