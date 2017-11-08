import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/observable';
import { filter, map, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { ModelDescription } from '../../../../../../common/metadata';
import * as fromModels from '../../reducers';
import * as models from '../../actions/models.actions';

@Component({
    selector: 'model-view-page',
    changeDetection: ChangeDetectionStrategy.OnPush, // TODO: what is this?
    templateUrl: 'model-view-page.html',
})
export class ModelviewPageComponent implements OnInit, OnDestroy {
    private onDestroy$ = new EventEmitter();
    private modelview$: Observable<string>;
    public model$: Observable<ModelDescription>;

    constructor(private store: Store<fromModels.State>, private activatedRoute: ActivatedRoute) {
        this.modelview$ = activatedRoute.params.pipe(map(params => params.model));
        this.modelview$
            .pipe(filter(modelview => !!modelview))
            .subscribe(modelview => this.store.dispatch(new models.LoadOneModel(modelview)));

        this.model$ = this.store.select(fromModels.getModelview).pipe(filter(x => !!x), map(x => x));
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this.onDestroy$.next();
    }
}
