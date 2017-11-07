import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/observable';
import { takeUntil, tap } from 'rxjs/operators';
import { ModelDescription } from '../../../../../../common/metadata';
import * as fromModels from '../../reducers';
import * as models from '../../actions/models.actions';

@Component({
    selector: 'models-collection-page',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'models-collection-page.html',
})
export class ModelCollectionPageComponent implements OnInit, OnDestroy {
    public models$: Observable<ModelDescription[]>;

    private onDestroy$ = new EventEmitter();

    constructor(private store: Store<fromModels.State>) {
        this.models$ = this.store.select(fromModels.getModels);
    }

    ngOnInit(): void {
        this.store.dispatch(new models.LoadModels());
    }

    ngOnDestroy(): void {
        this.onDestroy$.next();
    }
}
