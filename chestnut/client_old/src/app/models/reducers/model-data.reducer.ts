import { Action } from '@ngrx/store';
import * as modelDataAction from '../actions/modeldata.actions';

export interface State {
    modelData: {};
}

const initialState: State = {
    modelData: null,
};

export function reducer(state: State = initialState, action: modelDataAction.Actions): State {
    switch (action.type) {
        case modelDataAction.LOAD_MODEL_DATA_SUCCESS: {
            return { ...state, modelData: action.payload };
        }
    }
    return state;
}

export const getModelData = (state: State) => state.modelData;
