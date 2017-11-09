import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/observable';
import { filter, map, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import * as fromRoot from '../../reducers';
import * as modelDataAction from '../../actions/modeldata.actions';
import { ModelDescription } from '../../../../../../common/metadata';
import { State } from '../../../reducers';
@Component({
    selector: 'model-data-view-page',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'model-data-view-page.html',
})
export class ModelDataViewPageComponent implements OnInit, OnDestroy {
    private onDestroy$ = new EventEmitter();
    private dataEntryId$: Observable<string>;
    public modelData$: Observable<{}>;
    public modelView$: Observable<ModelDescription>;

    constructor(private store: Store<State>, private activatedRoute: ActivatedRoute) {
        this.dataEntryId$ = activatedRoute.params.pipe(map(params => params.dataId));
        this.dataEntryId$
            .pipe(filter(id => id !== null))
            .subscribe(id => this.store.dispatch(new modelDataAction.LoadModelData(id)));
        this.modelData$ = this.store.select(fromRoot.getModelData).pipe(filter(x => !!x));
        this.modelView$ = this.store
            .select(fromRoot.getModelview)
            .pipe(filter(x => !!x.modelView), map(x => x.modelView));
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this.onDestroy$.next();
    }
}
