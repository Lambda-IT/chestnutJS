import { Component, EventEmitter, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { map, mergeMap, takeUntil } from 'rxjs/operators';
import { modelSelectors } from '../../state/model.reducer';
import { fromFilteredSome } from '@shared/effects-helper';
import { composeManyQuery } from '@shared/graphql';
import { bindToOptionData } from '@shared/bind-functions';
import { Option } from 'fp-ts/lib/Option';
import { ColumnsChangedAction } from '../../state/model.effects';

@Component({
    selector: 'app-model-page',
    templateUrl: './model-page.component.html',
    styleUrls: ['./model-page.component.scss'],
})
export class ModelPageComponent implements OnDestroy {
    private destroying$ = new EventEmitter();
    model$: Observable<any>;
    availableColumns$: Observable<Option<string[]>>;
    visibleColumns$: Observable<Option<string[]>>;
    selectedColumnsChanged$ = new EventEmitter<string[]>();

    constructor(private store: Store<any>, private activatedRoute: ActivatedRoute, private apollo: Apollo) {
        const modelNameParam = this.activatedRoute.snapshot.params['modelName'];

        this.availableColumns$ = this.store
            .select(modelSelectors.getAvailableColumns)
            .pipe(map(x => x.map(p => p[modelNameParam])));

        this.visibleColumns$ = this.store
            .select(modelSelectors.getVisibleColumns)
            .pipe(map(x => x.map(p => p[modelNameParam])));

        this.model$ = this.availableColumns$.pipe(
            fromFilteredSome(),
            mergeMap(p =>
                this.apollo
                    .watchQuery({
                        query: composeManyQuery(modelNameParam, p),
                        fetchPolicy: 'cache-and-network',
                    })
                    .valueChanges.pipe(bindToOptionData(modelNameParam, 'Many'))
            )
        );

        this.selectedColumnsChanged$.pipe(
            takeUntil(this.destroying$))
            .subscribe(columns => this.store.dispatch(new ColumnsChangedAction({ [modelNameParam]: columns })));
    }

    ngOnDestroy(): void {
        this.destroying$.emit();
    }
}
