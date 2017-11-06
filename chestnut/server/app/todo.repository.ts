import * as cuid from 'cuid';

import { Todo } from '../../common/models';

let todos: Todo[] = [
    { id: cuid(), description: `Learn GraphQL`, completed: false },
    { id: cuid(), description: `Learn about what's new in Angular 5`, completed: false },
];

class TodoRepository {
    public getAllTodos = async () => todos;
    public getTodoById = async (id: string) => todos.find(t => t.id === id);
    public setCompleted = async (id: string, completed: boolean) => {
        todos = todos.map(t => (t.id === id ? { ...t, completed } : t));
        return await this.getTodoById(id);
    };
}

export const todoRepository = new TodoRepository();
