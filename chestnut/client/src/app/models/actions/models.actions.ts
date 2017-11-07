import { ModelDescription } from '../../../../../common/metadata';

export const LOAD_MODELS = '[Models] Load';
export const LOAD_MODELS_SUCCESS = '[Models] Load Success';
export const LOAD_ONE_MODEL = '[Model] Load One';
export const LOAD_ONE_MODEL_SUCCESS = '[Model] Load One Success';

export class LoadModels {
    readonly type = LOAD_MODELS;
    public payload: null;
}

export class LoadModelsSuccess {
    readonly type = LOAD_MODELS_SUCCESS;
    constructor(public payload: ModelDescription[]) {}
}

export class LoadOneModel {
    readonly type = LOAD_ONE_MODEL;
    constructor(public payload: ModelDescription) {}
}

export class LoadOneModelSuccess {
    readonly type = LOAD_ONE_MODEL_SUCCESS;
    constructor(public payload: ModelDescription) {}
}

export type Actions = LoadModels | LoadModelsSuccess | LoadOneModel;
