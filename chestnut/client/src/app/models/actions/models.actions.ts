import { ModelDescription } from '../../../../../common/metadata';

export const LOAD_MODELS = '[Models] Load';
export const LOAD_MODELS_SUCCESS = '[Models] Load Success';
export const LOAD_ONE_MODEL = '[Model] Load One';
export const LOAD_ONE_MODEL_SUCCESS = '[Model] Load One Success';
export const CLICK_MODEL_NAME = '[Model] Click Name';

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
    constructor(public payload: string) {}
}

export class LoadOneModelSuccess {
    readonly type = LOAD_ONE_MODEL_SUCCESS;
    constructor(public payload: ModelDescription) {}
}

export class ClickModelName {
    readonly type = CLICK_MODEL_NAME;
    constructor(public payload: string) {}
}
export type Actions = LoadModels | LoadModelsSuccess | LoadOneModel | LoadOneModelSuccess | ClickModelName;
