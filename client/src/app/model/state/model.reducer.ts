import { FormlyFieldConfig } from '@ngx-formly/core';
import { ReducerBuilder } from 'ngrx-reducer-builder';
import { ApplyMetadataLoadingAction, ApplyMetadataLoadedAction, ApplyUserVisibleColumnsAction } from '@shared/state/actions';
import { Action, createFeatureSelector, createSelector } from '@ngrx/store';
import { Option, none, some } from 'fp-ts/lib/Option';
import { ErrorType } from '@shared/bind-functions';
import { Either } from 'fp-ts/lib/Either';
import { transformMetadataToForm, transformMetadataToProperties } from './data-transformations';
import { MetadataDto } from '../../../../../common/metadata';

export interface ModelPageModel {
    availableColumnMap: Option<{ [key: string]: string[] }>;
    userVisibleColumnMap: Option<{ [key: string]: string[] }>;
    loaded: boolean;
    loading: boolean;
    error: Option<ErrorType>;
}

export interface ModelDetailPageModel {
    formFieldConfigMap: Option<FormlyFieldConfigMap>;
    propertyMap: Option<{ [key: string]: string[] }>;
    loaded: boolean;
    loading: boolean;
    error: Option<ErrorType>;
}

export interface FormlyFieldConfigMap {
    [key: string]: FormlyFieldConfig[];
}
export interface ModelState {
    modelDetailPageModel: ModelDetailPageModel;
    modelPageModel: ModelPageModel;
}

const transformMetadata = (metadata: Either<ErrorType, MetadataDto>) =>
    metadata.fold<ModelState>(
        l => ({
            modelDetailPageModel: {
                loaded: false,
                loading: false,
                error: some(l),
                formFieldConfigMap: none,
                propertyMap: none,
            },
            modelPageModel: {
                loaded: false,
                loading: false,
                error: some(l),
                availableColumnMap: none,
                userVisibleColumnMap: none
            },
        }),
        r => ({
            modelDetailPageModel: {
                loaded: true,
                loading: false,
                formFieldConfigMap: some(transformMetadataToForm(r)),
                propertyMap: some(transformMetadataToProperties(r)),
                error: none,
            },
            modelPageModel: {
                loaded: true,
                loading: false,
                availableColumnMap: some(transformMetadataToProperties(r)),
                error: none,
                userVisibleColumnMap: some(transformMetadataToProperties(r))
            },
        })
    );

export class ApplyColumnsChangedAction {
    public readonly type = 'APPLY_COLUMNS_CHANGED';
    constructor(public payload: { [model: string]: string[] }) { }
}

export const reducer = new ReducerBuilder<ModelState>()
    .handle(
        ApplyMetadataLoadingAction,
        (state, action) =>
            <ModelState>{
                modelPageModel: { ...state.modelPageModel, loading: true },
                modelDetailPageModel: { ...state.modelDetailPageModel, loading: true },
            }
    )
    .handle(ApplyMetadataLoadedAction, (state, action) => ({
        ...transformMetadata(action.payload),
    }))
    .handle(ApplyUserVisibleColumnsAction, (state, action) => ({
        ...state,
        modelPageModel: {
            ...state.modelPageModel,
            userVisibleColumnMap: state.modelPageModel.userVisibleColumnMap.map(x => ({ ...x, ...action.payload }))
        }
    }))
    .handle(ApplyColumnsChangedAction, (state, action) => ({
        ...state,
        modelPageModel: {
            ...state.modelPageModel,
            userVisibleColumnMap: state.modelPageModel.userVisibleColumnMap.map(x => ({ ...x, ...action.payload }))
        }
    }))
    .build({
        modelDetailPageModel: {
            loaded: false,
            loading: false,
            error: none,
            formFieldConfigMap: none,
            propertyMap: none,
        },
        modelPageModel: {
            loaded: false,
            loading: false,
            error: none,
            availableColumnMap: none,
            userVisibleColumnMap: none
        },
    });

export const getModelState = createFeatureSelector<ModelState>('model');
export const modelSelectors = {
    getFormFieldConfigMap: createSelector(getModelState, state => state.modelDetailPageModel.formFieldConfigMap),
    getProperties: createSelector(getModelState, state => state.modelDetailPageModel.propertyMap),
    getAvailableColumns: createSelector(getModelState, state => state.modelPageModel.availableColumnMap),
    getVisibleColumns: createSelector(getModelState, state => state.modelPageModel.userVisibleColumnMap)
};

export function modelReducer(state: ModelState, action: Action): ModelState {
    return reducer(state, action);
}
