import { Component, Input, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { map, withLatestFrom, merge, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { fromInput } from '@shared/rxjs-utils';
import * as memento from '@shared/bind-functions';

@Component({
    selector: 'app-modeldetail',
    templateUrl: './modeldetail.component.html',
    styleUrls: ['./modeldetail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModeldetailComponent {
    @Input()
    model: any;
    @Input()
    fields: FormlyFieldConfig[];
    @Input()
    modelName: string;

    // tslint:disable-next-line:no-output-rename
    @Output('submit')
    submit$ = new EventEmitter();

    model$: Observable<memento.Mementoable<any>>;
    reset$ = new EventEmitter();
    form = new FormGroup({});

    constructor() {
        const onSave$ = this.submit$.pipe(map(memento.unit));
        const fromModel$ = fromInput(this, 'model').pipe(map(m => memento.unit(m)));

        const memento$ = fromModel$.pipe(
            map(x => x.createMemento()),
            merge(onSave$.pipe(map(x => x.createMemento())))
        );

        const onReset$ = this.reset$.pipe(
            withLatestFrom(memento$, fromModel$),
            map(([_, mem, m]) => m.restoreMemento(mem))
        );

        this.model$ = fromModel$.pipe(merge(onReset$, onSave$));
    }

    submit(model: any) {
        this.submit$.emit(model);
    }
}
