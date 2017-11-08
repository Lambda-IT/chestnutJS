import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromRoot from '../../reducers';
import * as fromModelData from './model-data.reducer';
import * as fromModels from './models.reducer';
export type ModelsState = fromModels.State;
export type ModelDataState = fromModelData.State;

export const reducers = fromRoot.reducers;

export const getModelsState = createFeatureSelector<ModelsState>('modelsReducer');
export const getModelDataState = createFeatureSelector<ModelDataState>('modelDataReducer');

export const getModels = createSelector(getModelsState, fromModels.getModels);
export const getModelview = createSelector(getModelsState, fromModels.getModelView);
export const getModelData = createSelector(getModelDataState, fromModelData.getModelData);
