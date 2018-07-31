import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Option } from 'fp-ts/lib/Option';
import { MetadataInDto } from '../../state/catalog.effect';
import { catalogSelectors } from '../../state/catalog.reducer';

@Component({
    selector: 'app-catalog-page',
    templateUrl: './catalog-page.component.html',
    styleUrls: ['./catalog-page.component.scss']
})
export class CatalogPageComponent {

    model$: Observable<Option<MetadataInDto>>;
    loading$: Observable<boolean>;

    constructor(private store: Store<any>) {
        this.model$ = this.store.select(catalogSelectors.getCatalogModel);
        this.loading$ = this.store.select(catalogSelectors.isLoading);
    }
}
