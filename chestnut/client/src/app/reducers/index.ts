import { ActionReducerMap, createSelector, createFeatureSelector, ActionReducer, MetaReducer } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';
import * as fromModels from '../../app/models/reducers';
import { storeFreeze } from 'ngrx-store-freeze';
import { storeLogger } from 'ngrx-store-logger';

import { environment } from '../../environments/environment';
import { RouterStateUrl } from '../shared/utils';

export interface State {
    routerReducer: fromRouter.RouterReducerState<RouterStateUrl>;
    modelsReducer: fromModels.State;
}

export const reducers: ActionReducerMap<State> = {
    routerReducer: fromRouter.routerReducer,
    modelsReducer: fromModels.reducers,
};

export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
    return storeLogger()(reducer);
}

export const metaReducers: MetaReducer<State>[] = !environment.production ? [logger, storeFreeze] : [];
