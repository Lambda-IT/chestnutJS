import { Action } from '@ngrx/store';

import { Todo } from '../../models';
import * as todos from '../actions/todos.actions';

export type State = Todo[];

const initialState = [];

export function reducer(state: State = initialState, action: todos.Actions): State {
    switch (action.type) {
        case todos.LOAD_TODOS_SUCCESS: {
            return action.payload;
        }
        case todos.SET_COMPLETED_SUCCESS: {
            return state.map(t => (t.id === action.payload.id ? action.payload : t));
        }
    }
    return state;
}

export const getTodos = (state: State) => state;
