import { Component, Input, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { map, withLatestFrom, merge, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { fromInput } from '@shared/rxjs-utils';
import { Memento, unit } from '@shared/bind-functions';

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

    model$: Observable<Memento<any>>;
    reset$ = new EventEmitter();
    form = new FormGroup({});

    constructor() {
        const fromModel$ = fromInput(this, 'model').pipe(
            map(m => unit(m)),
            tap(x => x.createMemento())
        );

        const onReset$ = this.reset$.pipe(
            withLatestFrom(fromModel$),
            map(([_, m]) => {
                m.restoreMemento();
                return m;
            })
        );

        this.model$ = fromModel$.pipe(merge(onReset$));
    }

    submit(model: any) {
        this.submit$.emit(model);
    }
}
