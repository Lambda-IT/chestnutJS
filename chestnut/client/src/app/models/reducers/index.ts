import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromModels from './models.reducer';

export type State = fromModels.State;

export const reducers = fromModels.reducer;

export const getModelsState = createFeatureSelector<State>('models');

export const getModels = createSelector(getModelsState, fromModels.getModels);
