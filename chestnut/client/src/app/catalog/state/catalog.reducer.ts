import { Option, none, some } from 'fp-ts/lib/Option';
import { ReducerBuilder } from 'ngrx-reducer-builder';
import { createFeatureSelector, createSelector, Action } from '@ngrx/store';
import { ErrorType } from '@shared/bind-functions';
import { ApplyMetadataLoadingAction, ApplyMetadataLoadedAction, MetadataDto } from '@shared/state/actions';
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

export class ApplyCountQueryExecutedAction {
    readonly type = 'COUNT_QUERY_EXECUTED';
    constructor(public payload: { name: string; count: number }[]) {}
}

const reducer = new ReducerBuilder<CatalogPageState>()
    .handle(ApplyMetadataLoadingAction, state => ({ ...state, loading: true }))
    .handle(ApplyMetadataLoadedAction, (state, action) => ({
        ...state,
        ...transformMetadata(action.payload),
    }))
    .handle(ApplyCountQueryExecutedAction, (state, action) => ({
        ...state,
        model: state.model.map(x => action.payload),
        loaded: true,
        loading: false,
    }))
    .build({
        model: none,
        loaded: false,
        loading: false,
        error: none,
    });

export const getCatalogState = createFeatureSelector<CatalogPageState>('catalog');
export const catalogSelectors = {
    getCatalogModel: createSelector(getCatalogState, state => state.model),
    isLoading: createSelector(getCatalogState, state => state.loading),
    loaded: createSelector(getCatalogState, state => state.loaded),
};

const transformMetadata = (metadata: Either<ErrorType, MetadataDto>) =>
    metadata.fold<CatalogPageState>(
        l => ({ loaded: true, loading: false, error: some(l), model: none }),
        r => ({
            loaded: false,
            loading: true,
            model: some(r.models.map(p => <CatalogModel>{ name: p.name })),
            error: none,
        })
    );

export function catalogReducer(state: CatalogPageState, action: Action): CatalogPageState {
    return reducer(state, action);
}
