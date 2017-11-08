import { Action } from '@ngrx/store';
import { ModelDescription } from '../../../../../common/metadata';
import * as models from '../actions/models.actions';
import { ModelViewData } from '../../shared/model-view-data';
export interface State {
    models: ModelDescription[];
    modelView: ModelDescription;
}
// export type State = ModelDescription[];

const initialState: State = {
    models: null,
    modelView: null,
};

export function reducer(state: State = initialState, action: models.Actions): State {
    switch (action.type) {
        case models.LOAD_MODELS_SUCCESS: {
            return Object.assign({}, state, { models: action.payload });
        }
        case models.LOAD_ONE_MODEL_SUCCESS: {
            // TODO: rename action
            return Object.assign({}, state, { modelView: action.payload });
        }
    }
    return state;
}

export const getModels = (state: State) => state.models;
export const getModelView = (state: State) => state.modelView;
