import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromTodos from './todos.reducer';

export type State = fromTodos.State;

export const reducers = fromTodos.reducer;

export const getTodosState = createFeatureSelector<State>('todos');

export const getTodos = createSelector(getTodosState, fromTodos.getTodos);
