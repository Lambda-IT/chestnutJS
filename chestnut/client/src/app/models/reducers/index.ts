import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromRoot from '../../reducers';
import * as fromModels from './models.reducer';
export type ModelsState = fromModels.State;

export const reducers = fromRoot.reducers;

export const getModelsState = createFeatureSelector<ModelsState>('modelsReducer');

export const getModels = createSelector(getModelsState, fromModels.getModels);
export const getModelview = createSelector(getModelsState, fromModels.getModelView);
