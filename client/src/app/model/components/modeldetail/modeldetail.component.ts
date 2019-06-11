import { Component, Input, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { map, withLatestFrom, tap, filter } from 'rxjs/operators';
import { merge, Observable } from 'rxjs';
import { fromInput } from '@shared/rxjs-utils';
import * as memento from '@shared/bind-functions';
import { ReactiveComponent } from '@core/reactive-component/reactive-component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Either } from 'fp-ts/lib/Either';

@Component({
    selector: 'app-modeldetail',
    templateUrl: './modeldetail.component.html',
    styleUrls: ['./modeldetail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModeldetailComponent extends ReactiveComponent<ModeldetailComponent> {
    @Input()
    model: any;
    @Input()
    fields: FormlyFieldConfig[];
    @Input()
    title: string;
    @Input()
    mutationData: Either<string, null>;
    @Input()
    showBackNavigation: boolean;

    @Output()
    submit$ = new EventEmitter();

    options: FormlyFormOptions = {};
    model$: Observable<memento.Mementoable<any>>;
    reset$ = new EventEmitter();
    form = new FormGroup({});

    mutationData$ = this.observePropertyCurrentValue('mutationData').pipe(filter(x => !!x));

    constructor(private snackBar: MatSnackBar) {
        super();
        this.mutationData$
            .pipe(
                tap(x => {
                    if (x.isRight()) {
                        setTimeout(() =>
                            this.snackBar.open('Die Daten wurden erfolgreich gespeichert', 'X', {
                                duration: 5000,
                                horizontalPosition: 'center',
                                verticalPosition: 'top',
                                panelClass: 'success-message',
                            })
                        );
                    } else {
                        const message = `Es gab ein Problem beim Speichern der Daten:  ${x}`;
                        setTimeout(() =>
                            this.snackBar.open(message, 'X', {
                                duration: 5000,
                                horizontalPosition: 'center',
                                verticalPosition: 'top',
                                panelClass: 'error-message',
                            })
                        );
                    }
                })
            )
            .subscribe();

        const onSave$ = this.submit$.pipe(map(memento.unit));

        const fromModel$ = fromInput<ModeldetailComponent>(this)('model').pipe(map(m => memento.unit(m)));

        const memento$ = merge(fromModel$, onSave$).pipe(map(x => x.createMemento()));

        const onReset$ = this.reset$.pipe(
            withLatestFrom(memento$, fromModel$),
            map(([_, mem, m]) => m.restoreMemento(mem))
        );

        this.model$ = merge(fromModel$, onReset$, onSave$);
    }

    submit(model: any) {
        this.submit$.emit(model);
    }
}
