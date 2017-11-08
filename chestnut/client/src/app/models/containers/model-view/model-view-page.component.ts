import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/observable';
import { filter, map, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { ModelDescription } from '../../../../../../common/metadata';
import * as fromModel from '../../reducers';
import * as models from '../../actions/models.actions';
import * as modelDataAction from '../../actions/model-data.actions';
import { State } from '../../../reducers';
@Component({
    selector: 'model-view-page',
    changeDetection: ChangeDetectionStrategy.OnPush, // TODO: what is this?
    templateUrl: 'model-view-page.html',
})
export class ModelviewPageComponent implements OnInit, OnDestroy {
    private onDestroy$ = new EventEmitter();
    private modelview$: Observable<string>;
    public model$: Observable<ModelDescription>;
    public modelData$: Observable<any>;

    constructor(private store: Store<State>, private activatedRoute: ActivatedRoute) {
        this.modelview$ = activatedRoute.params.pipe(map(params => params.model));
        this.modelview$
            .pipe(filter(modelview => !!modelview))
            .subscribe(modelview => this.store.dispatch(new models.LoadOneModel(modelview)));

        this.model$ = this.store.select(fromModel.getModelview).pipe(filter(x => !!x), map(x => x));
        this.model$.subscribe(model => this.store.dispatch(new modelDataAction.LoadModelData(model)));
        this.modelData$ = this.store.select(fromModel.getModelData).pipe(filter(x => x !== null));
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this.onDestroy$.next();
    }
}
