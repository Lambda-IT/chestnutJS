import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/observable';
import { takeUntil, tap } from 'rxjs/operators';

import * as fromTodos from '../../reducers';
import * as todos from '../../actions/todos.actions';
import { Todo } from '../../../models';

@Component({
    selector: 'todos-collection-page',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'todos-collection-page.html',
})
export class TodosCollectionPageComponent implements OnInit, OnDestroy {
    public todos$: Observable<Todo[]>;
    public setCompleted$ = new EventEmitter<{ id: string; completed: boolean }>();

    private onDestroy$ = new EventEmitter();

    constructor(private store: Store<fromTodos.State>) {
        this.todos$ = this.store.select(fromTodos.getTodos);

        this.setCompleted$
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(x => this.store.dispatch(new todos.SetCompleted(x)));
    }

    ngOnInit(): void {
        this.store.dispatch(new todos.LoadTodos());
    }

    ngOnDestroy(): void {
        this.onDestroy$.next();
    }
}
