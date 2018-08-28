import { Component, OnDestroy, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, forkJoin } from 'rxjs';
import { Option } from 'fp-ts/lib/Option';
import { catalogSelectors, CatalogModel, CountQueryExecuted } from '../../state/catalog.reducer';
import { composeCountQuery } from '@shared/graphql';
import { fromFilteredSome } from '@shared/effects-helper';
import { mergeMap, takeUntil, map, take } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { bindToOptionData } from '@shared/bind-functions';

@Component({
    selector: 'app-catalog-page',
    templateUrl: './catalog-page.component.html',
    styleUrls: ['./catalog-page.component.scss'],
})
export class CatalogPageComponent implements OnDestroy {
    private destroying$ = new EventEmitter();
    model$: Observable<Option<CatalogModel[]>>;
    loading$: Observable<boolean>;

    constructor(private store: Store<any>, private apollo: Apollo) {
        this.model$ = this.store.select(catalogSelectors.getCatalogModel);
        this.loading$ = this.store.select(catalogSelectors.isLoading);

        const count = countQuery(this.apollo, this.store);

        this.model$
            .pipe(
                fromFilteredSome(),
                take(1),
                mergeMap(p =>
                    forkJoin(p.map(c => count(c.name))).pipe(
                        map(joined => this.store.dispatch(new CountQueryExecuted(joined)))
                    )
                ),
                takeUntil(this.destroying$)
            )
            .subscribe();
    }

    ngOnDestroy() {
        this.destroying$.emit();
    }
}

export const countQuery = (apollo: Apollo, store: Store<any>) => (modelName: string) =>
    apollo
        .watchQuery({
            query: composeCountQuery(modelName),
            fetchPolicy: 'network-only',
        })
        .valueChanges.pipe(
            bindToOptionData(modelName, 'Count'),
            map(x => x.data),
            fromFilteredSome(),
            map((x: number) => ({ name: modelName, count: x })),
            take(1)
        );
