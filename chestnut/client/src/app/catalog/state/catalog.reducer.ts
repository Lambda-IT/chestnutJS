import { Option, none, some } from 'fp-ts/lib/Option';
import { ReducerBuilder } from '@shared/ngx-tools';
import { createFeatureSelector, createSelector, Action } from '@ngrx/store';
import { ErrorType } from '@shared/bind-functions';
import { MetadataLoading, MetadataLoaded, MetadataDto } from '@shared/actions';
import { Either } from 'fp-ts/lib/Either';

export interface CatalogModel {
    name: string;
}

export interface CatalogPageState {
    model: Option<CatalogModel[]>;
    loaded: boolean;
    loading: boolean;
    error: Option<ErrorType>;
}

const reducer = new ReducerBuilder<CatalogPageState>()
    .handle(MetadataLoading, state => ({ ...state, loading: true }))
    .handle(MetadataLoaded, (state, action) => {
        console.log('sdjfhsadjhkjhdsajghasdhkgh');
        return {
            ...state,
            ...transformMetadata(action.payload),
        };
    })
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
            loading: true,
            model: some(r.models.map(p => <CatalogModel>{ name: p.name })),
            error: none,
        })
    );

export function catalogReducer(state: CatalogPageState, action: Action): CatalogPageState {
    return reducer(state, action);
}
