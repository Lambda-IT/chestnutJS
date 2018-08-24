import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { map, mergeMap } from 'rxjs/operators';
import { modelSelectors } from '../../state/model.reducer';
import { fromFilteredSome } from '@shared/effects-helper';
import { composeManyQuery } from '@shared/graphql';
import { bindToOptionData } from '@shared/bind-functions';
import { Option } from 'fp-ts/lib/Option';

@Component({
    selector: 'app-model-page',
    templateUrl: './model-page.component.html',
    styleUrls: ['./model-page.component.scss'],
})
export class ModelPageComponent {
    model$: Observable<any>;
    properties$: Observable<Option<string[]>>;

    constructor(private store: Store<any>, private activatedRoute: ActivatedRoute, private apollo: Apollo) {
        const modelNameParam = this.activatedRoute.snapshot.params['modelName'];

        this.properties$ = this.store
            .select(modelSelectors.getProperties)
            .pipe(map(x => x.map(p => p[modelNameParam])));

        this.model$ = this.properties$.pipe(
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
    }
}
