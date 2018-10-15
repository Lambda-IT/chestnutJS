import { ReducerBuilder } from 'ngrx-reducer-builder';
import { ApplyLoginSuccessAction, ApplyLoginFailedAction, ApplyLogoutAction } from '@shared/state/actions';
import { createFeatureSelector, createSelector, Action } from '@ngrx/store';
import { Option, some, none } from 'fp-ts/lib/Option';

export interface SharedState {
    loggedIn: Option<boolean>;
}

export const reducer = new ReducerBuilder<SharedState>()
    .handle(ApplyLoginSuccessAction, (state, _) => ({
        ...state,
        loggedIn: some(true),
    }))
    .handle(ApplyLoginFailedAction, (state, _) => ({
        ...state,
        loggedIn: some(false)
    }))
    .handle(ApplyLogoutAction, (state, action) => ({
        ...state,
        loggedIn: some(false)
    }))
    .build({
        loggedIn: none,
    });

export const getSharedState = createFeatureSelector<SharedState>('shared');
export const sharedStateSelectors = {
    isLoggedIn: createSelector(getSharedState, state => state.loggedIn),
};

export function sharedStateReducer(state: SharedState, action: Action): SharedState {
    return reducer(state, action);
}
