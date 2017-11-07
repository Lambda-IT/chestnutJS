import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/observable';
import { filter } from 'rxjs/operators';
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
    public model$: Observable<ModelDescription>;

    constructor(private store: Store<fromModels.State>) {
        this.model$ = this.store.select(fromModels.getModelview).pipe(filter(x => !!x));
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this.onDestroy$.next();
    }
}
