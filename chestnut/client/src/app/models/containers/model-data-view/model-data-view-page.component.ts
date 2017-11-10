import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/observable';
import { filter, map, tap, withLatestFrom, publishReplay, refCount } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import * as fromRoot from '../../reducers';
import * as modelDataAction from '../../actions/modeldata.actions';
import * as modelViewAction from '../../actions/models.actions';
import { ModelDescription } from '../../../../../../common/metadata';
import { ModelViewData } from '../../../shared/model-view-data';
import { State } from '../../../reducers';
@Component({
    selector: 'model-data-view-page',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'model-data-view-page.html',
})
export class ModelDataViewPageComponent implements OnInit, OnDestroy {
    private onDestroy$ = new EventEmitter();
    private dataEntryId$: Observable<string>;
    private currentModel$: Observable<string>;
    public modelData$: Observable<{}>;
    public modelView$: Observable<ModelViewData>;
    public form$: Observable<FormGroup>;
    constructor(private store: Store<State>, private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder) {
        this.dataEntryId$ = activatedRoute.params.pipe(map(params => params.dataId));
        this.currentModel$ = activatedRoute.params.pipe(map(params => params.model));
        this.currentModel$
            .pipe(filter(current => current !== null))
            .subscribe(current => this.store.dispatch(new modelViewAction.LoadOneModel(current)));

        this.dataEntryId$
            .pipe(filter(id => id !== null))
            .subscribe(id => this.store.dispatch(new modelDataAction.LoadModelData(id)));
        this.modelView$ = this.store
            .select(fromRoot.getModelview)
            .pipe(filter(x => !!x.modelView), publishReplay(1), refCount());
        this.modelData$ = this.store.select(fromRoot.getModelData).pipe(filter(x => !!x));

        this.form$ = this.modelView$.pipe(
            withLatestFrom(this.modelData$, (model, data) => ({ model, data })),
            map(x =>
                x.model.modelView.properties.reduce(
                    (acc, cur, index) => {
                        acc[cur.name] = this.formBuilder.control(x.data[cur.name]);
                        return acc;
                    },
                    {} as FormGroup
                )
            ),
            filter(x => !!x),
            tap(x => console.log('selected', x))
        );
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this.onDestroy$.next();
    }
}
