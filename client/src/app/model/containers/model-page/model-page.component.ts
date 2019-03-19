import { Component, EventEmitter, OnDestroy } from '@angular/core';
import { merge, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { ApplyAddFilterItemAction, ApplyRemoveFilterItemAction, modelSelectors } from '../../state/model.reducer';
import { fromFilteredSome } from '@shared/effects-helper';
import { composeFilteredManyQuery, composeManyQuery } from '@shared/graphql';
import { bindToOptionData } from '@shared/bind-functions';
import { Option } from 'fp-ts/lib/Option';
import { ColumnsChangedAction } from '../../state/model.effects';
import { ContainerComponent } from '@core/reactive-component/container-component';
import { FilterItem, FilterMetadataModel } from '../../types';

@Component({
    selector: 'app-model-page',
    templateUrl: './model-page.component.html',
    styleUrls: ['./model-page.component.scss'],
})
export class ModelPageComponent extends ContainerComponent implements OnDestroy {
    private destroying$ = new EventEmitter();
    model$: Observable<any>;
    availableColumns$: Observable<Option<string[]>>;
    visibleColumns$: Observable<Option<string[]>>;
    filterMetadata$: Observable<FilterMetadataModel[]>;
    filters$: Observable<Option<FilterItem[]>>;
    selectedColumnsChanged$ = new EventEmitter<string[]>();
    addFilter$ = new EventEmitter<FilterItem>();
    removeFilter$ = new EventEmitter<FilterItem>();

    constructor(private store: Store<any>, private activatedRoute: ActivatedRoute, private apollo: Apollo) {
        super(store.dispatch.bind(store));
        const modelNameParam = this.activatedRoute.snapshot.params['modelName'];

        this.availableColumns$ = this.store
            .select(modelSelectors.getAvailableColumns)
            .pipe(map(x => x.map(p => p[modelNameParam])));

        this.visibleColumns$ = this.store
            .select(modelSelectors.getVisibleColumns)
            .pipe(map(x => x.map(p => p[modelNameParam])));

        this.filterMetadata$ = this.store.select(modelSelectors.getMetadataForFilter(modelNameParam));

        this.filterMetadata$.subscribe(x => console.log('filterMetadata$', x));

        const modelTriggeredByColumnChanged$ = this.availableColumns$.pipe(
            fromFilteredSome(),
            mergeMap(p => {
                return this.apollo
                    .watchQuery({
                        query: composeManyQuery(modelNameParam, p),
                        fetchPolicy: 'cache-and-network',
                    })
                    .valueChanges.pipe(bindToOptionData(modelNameParam, 'Many'));
            })
        );

        this.filters$ = this.store.select(modelSelectors.getItemFilters(modelNameParam));

        this.filters$.subscribe(x => console.log('filters$', x));

        const selectedColumnsChangedAction = this.selectedColumnsChanged$.pipe(
            map(columns => new ColumnsChangedAction({ [modelNameParam]: columns }))
        );

        const addFilterAction = this.addFilter$.pipe(
            map(filterItem => new ApplyAddFilterItemAction({ key: modelNameParam, filterItem: filterItem }))
        );
        const removeFilterAction = this.removeFilter$.pipe(
            map(filterItem => new ApplyRemoveFilterItemAction({ key: modelNameParam, filterItem: filterItem }))
        );

        const modelTriggeredByFilterChange$ = this.filters$.pipe(
            fromFilteredSome(),
            withLatestFrom(this.availableColumns$.pipe(fromFilteredSome()), (filterItems, cols) => ({
                filterItems: filterItems,
                columns: cols,
            })),
            mergeMap(x => {
                return this.apollo
                    .watchQuery({
                        query: composeFilteredManyQuery(modelNameParam, x.columns, x.filterItems),
                        fetchPolicy: 'cache-and-network',
                    })
                    .valueChanges.pipe(bindToOptionData(modelNameParam, 'Many'));
            })
        );

        // withLatestFrom(this.filterForm.valueChanges, (_, f) => f),

        this.model$ = merge(modelTriggeredByColumnChanged$, modelTriggeredByFilterChange$);

        this.dispatch(selectedColumnsChangedAction, addFilterAction, removeFilterAction);
    }

    ngOnDestroy(): void {
        this.destroying$.emit();
    }
}
