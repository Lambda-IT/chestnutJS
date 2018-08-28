import { Component, Input, ChangeDetectionStrategy, EventEmitter, OnDestroy } from '@angular/core';
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
export class ModeldetailComponent implements OnDestroy {
    private destroying$ = new EventEmitter();

    @Input()
    model: any;
    @Input()
    fields: FormlyFieldConfig[];
    @Input()
    modelName: string;

    model$: Observable<Memento<any>>;
    reset$ = new EventEmitter();
    form = new FormGroup({});

    constructor() {
        const fromModel$ = fromInput(this, 'model').pipe(
            map(m => unit(m)),
            tap(x => x.createMemento())
        );

        this.model$ = fromModel$.pipe(
            merge(
                this.reset$.pipe(
                    withLatestFrom(fromModel$),
                    map(([_, m]) => {
                        m.restoreMemento();
                        return m;
                    })
                )
            )
        );
    }

    submit(model: any) {
        console.log(model);
    }

    ngOnDestroy() {
        this.destroying$.emit();
    }
}
