export const LOAD_MODEL_DATA = '[Model Data] Load';

export class LoadModelData {
    readonly type = LOAD_MODEL_DATA;
    constructor(public payload: string) {} // id
}

export type Actions = LoadModelData;
