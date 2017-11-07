import { ModelDescription } from '../../../../../common/metadata';

export const LOAD_MODELS = '[Models] Load';
export const LOAD_MODELS_SUCCESS = '[Models] Load Success';

export class LoadModels {
    readonly type = LOAD_MODELS;
    public payload: null;
}

export class LoadModelsSuccess {
    readonly type = LOAD_MODELS_SUCCESS;
    constructor(public payload: ModelDescription[]) {}
}

export type Actions = LoadModels | LoadModelsSuccess;
