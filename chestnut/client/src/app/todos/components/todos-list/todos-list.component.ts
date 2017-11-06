import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Todo } from '../../models';

@Component({
    selector: 'todos-list',
    templateUrl: 'todos-list.html',
    styleUrls: ['todos-list.scss'],
})
export class TodosListComponent {
    @Input() todos: Todo[];
    @Output() setCompleted = new EventEmitter<{ id: string; completed: boolean }>();
    @Output() editTodo = new EventEmitter();
    @Output() deleteTodo = new EventEmitter();

    constructor() {}
}
