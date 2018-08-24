import { FormlyFieldConfig } from '@ngx-formly/core';
import { ReducerBuilder } from 'ngrx-reducer-builder';
import { MetadataLoading, MetadataLoaded, MetadataDto } from '@shared/actions';
import { Action, createFeatureSelector, createSelector } from '@ngrx/store';
import { Option, none, some } from 'fp-ts/lib/Option';
import { ErrorType } from '@shared/bind-functions';
import { Either } from 'fp-ts/lib/Either';
import { transformMetadataToForm, transformMetadataToProperties } from './data-transformations';

export interface FormlyFieldConfigMap {
    [key: string]: FormlyFieldConfig[];
}
export interface ModelState {
    formFieldConfigMap: Option<FormlyFieldConfigMap>;
    propertyMap: Option<{ [key: string]: string[] }>;
    loaded: boolean;
    loading: boolean;
    error: Option<ErrorType>;
}

const transformMetadata = (metadata: Either<ErrorType, MetadataDto>) =>
    metadata.fold<ModelState>(
        l => ({ loaded: false, loading: false, error: some(l), formFieldConfigMap: none, propertyMap: none }),
        r => ({
            loaded: true,
            loading: true,
            formFieldConfigMap: some(
                r.models.reduce(
                    (acc, model) => {
                        return { ...acc, [model.name]: transformMetadataToForm(model) };
                    },
                    {} as FormlyFieldConfigMap
                )
            ),
            propertyMap: some(transformMetadataToProperties(r)),
            error: none,
        })
    );

export const reducer = new ReducerBuilder<ModelState>()
    .handle(MetadataLoading, (state, action) => ({
        ...state,
        loading: true,
    }))
    .handle(MetadataLoaded, (state, action) => ({
        ...state,
        ...transformMetadata(action.payload),
    }))
    .build({
        loaded: false,
        loading: false,
        error: none,
        formFieldConfigMap: none,
        propertyMap: none,
    });

export const getModelState = createFeatureSelector<ModelState>('model');
export const modelSelectors = {
    getFormFieldConfigMap: createSelector(getModelState, state => state.formFieldConfigMap),
    isLoading: createSelector(getModelState, state => state.loading),
    getProperties: createSelector(getModelState, state => state.propertyMap),
};

export function modelReducer(state: ModelState, action: Action): ModelState {
    return reducer(state, action);
}
