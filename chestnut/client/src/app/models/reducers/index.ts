import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromRoot from '../../reducers';
import * as fromModels from './models.reducer';
import * as fromModelData from './model-data.reducer';
export const reducers = fromRoot.reducers;

export interface State {
    models: fromModels.State;
    modelData: fromModelData.State;
}

export const getModelsState = (state: fromRoot.State) => state.models;
export const getModelDataState = (state: fromRoot.State) => state.modelData;

export const getModelData = createSelector(getModelDataState, fromModelData.getModelData);
export const getModels = createSelector(getModelsState, fromModels.getModels);
export const getModelview = createSelector(getModelsState, fromModels.getModelView);
