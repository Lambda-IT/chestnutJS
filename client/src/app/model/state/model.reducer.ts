import { FormlyFieldConfig } from '@ngx-formly/core';
import { ReducerBuilder } from 'ngrx-reducer-builder';
import {
    ApplyMetadataLoadedAction,
    ApplyMetadataLoadingAction,
    ApplyUserVisibleColumnsAction,
} from '@shared/state/actions';
import { Action, createFeatureSelector, createSelector } from '@ngrx/store';
import { none, Option, some } from 'fp-ts/lib/Option';
import { ErrorType } from '@shared/bind-functions';
import { Either } from 'fp-ts/lib/Either';
import {
    buildColumnListForGraphQL,
    transformMetadataToForm,
    transformMetadataToProperties,
    transformMetadataToPropertyDefinition,
} from './data-transformations';
import { MetadataDto, PropertyDescription, PropertyType } from '@shared/contracts/metadata';
import { insert, lookup, remove } from 'fp-ts/lib/Record';
import { FilterItem, FilterMetadataModel, ViewComponent } from '../types/model-types';

export interface ModelPageModel {
    availableColumnMap: Option<{ [key: string]: string[] }>;
    userVisibleColumnMap: Option<{ [key: string]: string[] }>;
    graphqlColumnMap: Option<{ [key: string]: string[] }>;
    loaded: boolean;
    loading: boolean;
    error: Option<ErrorType>;
    // filterItem: StrMap<FilterItem[]>;
    filterItem: { [key: string]: FilterItem[] };

    model: Option<MetadataDto>;
}

export interface PropertyDefinition {
    name: string;
    properties: PropertyDescription[];
}

export interface ModelDetailPageModel {
    formFieldConfigMap: Option<FormlyFieldConfigMap>;
    propertyMap: Option<{ [key: string]: PropertyDefinition[] }>;
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
                userVisibleColumnMap: none,
                graphqlColumnMap: none,
                filterItem: {},
                model: none,
            },
        }),
        r => ({
            modelDetailPageModel: {
                loaded: true,
                loading: false,
                formFieldConfigMap: some(transformMetadataToForm(r)),
                propertyMap: some(transformMetadataToPropertyDefinition(r)),
                error: none,
            },
            modelPageModel: {
                loaded: true,
                loading: false,
                availableColumnMap: some(transformMetadataToProperties(r)),
                error: none,
                userVisibleColumnMap: some(transformMetadataToProperties(r)),
                graphqlColumnMap: some(buildColumnListForGraphQL(r)),

                model: some(r),
                filterItem: {},
            },
        })
    );

export class ApplyColumnsChangedAction {
    public readonly type = 'APPLY_COLUMNS_CHANGED';
    constructor(public payload: { [model: string]: string[] }) {}
}

export class ApplyAddFilterItemAction {
    public readonly type = 'APPLY_ADD_FILTER_ITEM_';
    constructor(public payload: FilterPayload) {}
}

export class ApplyRemoveFilterItemAction {
    public readonly type = 'APPLY_REMOVE_FILTER_ITEM_';
    constructor(public payload: FilterPayload) {}
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
            userVisibleColumnMap: state.modelPageModel.userVisibleColumnMap.map(x => ({ ...x, ...action.payload })),
        },
    }))
    .handle(ApplyColumnsChangedAction, (state, action) => ({
        ...state,
        modelPageModel: {
            ...state.modelPageModel,
            userVisibleColumnMap: state.modelPageModel.userVisibleColumnMap.map(x => ({ ...x, ...action.payload })),
        },
    }))
    .handle(
        ApplyAddFilterItemAction,
        (state, action): ModelState => {
            // gets the list of filteritems for provided key and adds provided filteritem to list
            const currentValues = lookup(action.payload.key, state.modelPageModel.filterItem).getOrElse([]);
            return {
                ...state,
                modelPageModel: {
                    ...state.modelPageModel,
                    filterItem: insert(
                        action.payload.key,
                        [...currentValues, action.payload.filterItem],
                        state.modelPageModel.filterItem
                    ),
                },
            };
        }
    )
    .handle(
        ApplyRemoveFilterItemAction,
        (state, action): ModelState => {
            // gets the list of filteritems for provided key and removes provided filteritem
            const newValueToInsert = lookup(action.payload.key, state.modelPageModel.filterItem)
                .map(filters => filters.filter(item => item !== action.payload.filterItem))
                .getOrElse([]);
            return {
                ...state,
                modelPageModel: {
                    ...state.modelPageModel,
                    filterItem: insert(action.payload.key, newValueToInsert, state.modelPageModel.filterItem),
                },
            };
        }
    )
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
            userVisibleColumnMap: none,
            graphqlColumnMap: none,
            filterItem: {},
            model: none,
        },
    });

export const getModelState = createFeatureSelector<ModelState>('model');

export const modelSelectors = {
    getFormFieldConfigMap: createSelector(
        getModelState,
        state => state.modelDetailPageModel.formFieldConfigMap
    ),
    getProperties: createSelector(
        getModelState,
        state => state.modelDetailPageModel.propertyMap
    ),
    getAvailableColumns: createSelector(
        getModelState,
        state => state.modelPageModel.availableColumnMap
    ),
    getVisibleColumns: createSelector(
        getModelState,
        state => state.modelPageModel.userVisibleColumnMap
    ),
    getColumsForGraphql: createSelector(
        getModelState,
        state => state.modelPageModel.graphqlColumnMap
    ),
    getItemFilters: field =>
        createSelector(
            getModelState,
            (state: ModelState) => getModelState(state).modelPageModel.filterItem,
            filter => lookup(`${field}`, filter.modelPageModel.filterItem)
        ),

    getMetadataForFilter: modelname =>
        createSelector(
            getModelState,
            (state: ModelState) => getViewModelForMetadata(state.modelPageModel.model, modelname)
        ),
};

export function modelReducer(state: ModelState, action: Action): ModelState {
    return reducer(state, action);
}

export interface FilterPayload {
    key: string;
    filterItem;
}

export function getViewModelForMetadata(metadata: Option<MetadataDto>, modelName: string): FilterMetadataModel[] {
    const model = metadata.map(metaDto => metaDto.models.filter(m => m.name === modelName)).getOrElse([]);

    return model.map(m =>
        m.properties.map(prop => ({
            name: prop.name,
            values: createValues(prop),
            viewComponent: getViewComponent(prop.type),
            hasOperator: prop.index ? prop.index : false,
        }))
    )[0];
}

export function createValues(prop: PropertyDescription) {
    switch (prop.type) {
        case PropertyType.boolean:
            return [true, false];
        default:
            return '';
    }
}

export function getViewComponent(prop: PropertyType) {
    switch (prop) {
        case PropertyType.boolean:
        case PropertyType.array:
            return ViewComponent.select;
        case PropertyType.number:
            return ViewComponent.number;
        case PropertyType.date:
        case PropertyType.dateTime:
            return ViewComponent.date;
        default:
            return ViewComponent.stringInput;
    }
}
