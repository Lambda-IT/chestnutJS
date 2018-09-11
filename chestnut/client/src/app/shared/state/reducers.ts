import { ReducerBuilder } from 'ngrx-reducer-builder';
import { LoginSuccess, LoginFailed } from '@shared/state/actions';
import { createFeatureSelector, createSelector, Action } from '@ngrx/store';

export interface SharedState {
    loggedIn: boolean;
}

export const reducer = new ReducerBuilder<SharedState>()
    .handle(LoginSuccess, (state, _) => ({
        ...state,
        loggedIn: true,
    }))
    .handle(LoginFailed, (state, _) => ({
        ...state,
        loggedIn: false
    }))
    .build({
        loggedIn: false,
    });

export const getSharedState = createFeatureSelector<SharedState>('shared');
export const sharedStateSelectors = {
    isLoggedIn: createSelector(getSharedState, state => state.loggedIn),
};

export function sharedStateReducer(state: SharedState, action: Action): SharedState {
    return reducer(state, action);
}
