export const LOAD_MODEL_DATA = '[Model Data] Load';
export const LOAD_MODEL_DATA_SUCCESS = '[Model Data] Load Success';
export class LoadModelData {
    readonly type = LOAD_MODEL_DATA;
    constructor(public payload: string) {} // id
}
export class LoadModelDataSuccess {
    readonly type = LOAD_MODEL_DATA_SUCCESS;
    constructor(public payload: {}) {} // data from gql
}

export type Actions = LoadModelData | LoadModelDataSuccess;
