import { Action } from '@ngrx/store';
import { ModelDescription } from '../../../../../common/metadata';
import * as models from '../actions/models.actions';
import { ModelViewData } from '../../shared/model-view-data';

export interface State {
    models: ModelDescription[];
    modelView: ModelViewData;
}

const initialState: State = {
    models: null,
    modelView: null,
};

export function reducer(state: State = initialState, action: models.Actions): State {
    switch (action.type) {
        case models.LOAD_MODELS_SUCCESS: {
            return { ...state, models: action.payload };
        }
        case models.LOAD_ONE_MODEL_SUCCESS: {
            return { ...state, modelView: action.payload };
        }
        case models.SET_PROPERTY_VISIBILITY: {
            const propertyName = action.payload;
            return Object.assign({}, state, {
                modelView: Object.assign({}, state.modelView, {
                    modelView: Object.assign({}, state.modelView.modelView, {
                        properties: state.modelView.modelView.properties.map(
                            prop =>
                                prop.name === propertyName ? Object.assign({}, prop, { hidden: !prop.hidden }) : prop
                        ),
                    }),
                }),
            });
            // return {
            //     ...state,
            //     modelView: {
            //         ...state.modelView.modelView,
            //         modelView: {
            //             ...properties,
            //             properties: state.modelView.modelView.properties.map(
            //                 prop =>
            //                     prop.name === propertyName ? Object.assign({}, prop, { hidden: !prop.hidden }) : prop
            //             ),
            //         },
            //     },
            // };
        }
        default:
            return state;
    }
}

export const getModels = (state: State) => state.models;
export const getModelView = (state: State) => state.modelView;
