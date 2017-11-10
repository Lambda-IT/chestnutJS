import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/observable';
import { filter, map, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { ModelDescription, PropertyDescription } from '../../../../../../common/metadata';
import { ModelViewData } from '../../../shared/model-view-data';
import * as fromModel from '../../reducers';
import * as models from '../../actions/models.actions';
import { State } from '../../../reducers';
@Component({
    selector: 'model-view-page',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'model-view-page.html',
})
export class ModelviewPageComponent implements OnInit, OnDestroy {
    private onDestroy$ = new EventEmitter();
    private modelViewTitle$: Observable<string>;
    public modelView$: Observable<ModelViewData>;

    constructor(private store: Store<State>, private activatedRoute: ActivatedRoute) {
        this.modelViewTitle$ = activatedRoute.params.pipe(map(params => params.model));
        this.modelViewTitle$
            .pipe(filter(modelViewTitle => !!modelViewTitle))
            .subscribe(modelViewTitle => this.store.dispatch(new models.LoadOneModel(modelViewTitle)));

        this.modelView$ = this.store.select(fromModel.getModelview).pipe(filter(x => !!x));
    }

    setPropertyVisibility(prop: string) {
        this.store.dispatch(new models.ClickPropertyVisibility(prop));
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this.onDestroy$.next();
    }
}
