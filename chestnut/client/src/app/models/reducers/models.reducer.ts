import { Action } from '@ngrx/store';
import { ModelDescription } from '../../../../../common/metadata';
import * as models from '../actions/models.actions';

export type State = ModelDescription[];

const initialState = [];

export function reducer(state: State = initialState, action: models.Actions): State {
    switch (action.type) {
        case models.LOAD_MODELS_SUCCESS: {
            return action.payload;
        }
    }
    return state;
}

export const getModels = (state: State) => state;
