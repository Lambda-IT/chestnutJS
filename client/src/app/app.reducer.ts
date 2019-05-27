import { ReducerBuilder } from 'ngrx-reducer-builder';
import { none, Option, some } from 'fp-ts/lib/Option';
import { ErrorType } from '@shared/bind-functions';
import { ApplyMetadataLoadingAction, ApplyMetadataLoadedAction } from '@shared/state/actions';
import { Action, createFeatureSelector, createSelector } from '@ngrx/store';
import { MetadataDto } from '../../../common/metadata';

export interface AppState {
    loaded: boolean;
    loading: boolean;
    error: Option<ErrorType>;
    model: Option<MetadataDto>;
}

export const reducer = new ReducerBuilder<AppState>()
    .handle(ApplyMetadataLoadingAction, (state, action) => ({
        ...state,
        loading: true,
    }))
    .handle(ApplyMetadataLoadedAction, (state, action) => ({
        ...state,
        ...action.payload.fold<AppState>(
            l => ({ loaded: false, loading: false, error: some(l), model: none }),
            r => ({ loaded: true, loading: false, model: some(r), error: none })
        ),
    }))
    .build({
        loaded: false, // indicate that data are ready
        loading: false, // indicate Loading
        error: none,
        model: none,
    });

export const getAppState = createFeatureSelector<AppState>('app');
export const appSelectors = {
    error: createSelector(
        getAppState,
        state => state.error
    ),
};

export function appReducer(state: AppState, action: Action): AppState {
    return reducer(state, action);
}
