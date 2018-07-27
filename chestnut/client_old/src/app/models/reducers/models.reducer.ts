import { Action } from '@ngrx/store';
import { ModelDescription } from '../../../../../common/metadata';
import * as models from '../actions/models.actions';
import { ModelViewData } from '../../shared/model-view-data';

export interface State {
    allModels: ModelDescription[];
    modelViewData: ModelViewData;
}

const initialState: State = {
    allModels: null,
    modelViewData: null,
};

export function reducer(state: State = initialState, action: models.Actions): State {
    switch (action.type) {
        case models.LOAD_MODELS_SUCCESS: {
            return { ...state, allModels: action.payload };
        }
        case models.LOAD_ONE_MODEL_SUCCESS: {
            return { ...state, modelViewData: action.payload };
        }
        case models.SET_PROPERTY_VISIBILITY: {
            const propertyName = action.payload;
            return {
                ...state,
                modelViewData: {
                    ...state.modelViewData,
                    modelView: {
                        ...state.modelViewData.modelView,
                        properties: state.modelViewData.modelView.properties.map(
                            prop =>
                                prop.name === propertyName ? Object.assign({}, prop, { hidden: !prop.hidden }) : prop
                        ),
                    },
                },
            };
        }
        default:
            return state;
    }
}

export const getModels = (state: State) => state.allModels;
export const getModelView = (state: State) => state.modelViewData;
