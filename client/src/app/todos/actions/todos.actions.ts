import { Todo } from '../../models';

// export enum ActionTypes {
export const LOAD_TODOS = '[Todos] Load';
export const LOAD_TODOS_SUCCESS = '[Todos] Load Success';
export const SET_COMPLETED = '[Todos] Set Completed';
export const SET_COMPLETED_SUCCESS = '[Todos] Set Completed Success';
// }

export class LoadTodos {
    readonly type = LOAD_TODOS;
    public payload: null;
}

export class LoadTodosSuccess {
    readonly type = LOAD_TODOS_SUCCESS;
    constructor(public payload: Todo[]) {}
}

export class SetCompleted {
    readonly type = SET_COMPLETED;
    constructor(public payload: { id: string; completed: boolean }) {}
}

export class SetCompletedSucccess {
    readonly type = SET_COMPLETED_SUCCESS;
    constructor(public payload: Todo) {}
}

export type Actions = LoadTodos | LoadTodosSuccess | SetCompleted | SetCompletedSucccess;
