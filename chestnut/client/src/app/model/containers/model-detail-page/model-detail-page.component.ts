import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { modelSelectors } from '../../state/model.reducer';
import { Observable } from 'rxjs';
import { Option } from 'fp-ts/lib/Option';
import { mergeMap, map } from 'rxjs/operators';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { composeByIdQuery } from '@shared/graphql';
import { fromFilteredSome } from '@shared/effects-helper';
import { bindToOptionData } from '@shared/bind-functions';

@Component({
    selector: 'app-model-detail-page',
    templateUrl: './model-detail-page.component.html',
    styleUrls: ['./model-detail-page.component.scss'],
})
export class ModelDetailPageComponent {
    fields$: Observable<Option<FormlyFieldConfig[]>>;
    model$: Observable<any>;
    modelNameParam: string;

    constructor(private store: Store<any>, private activatedRoute: ActivatedRoute, private apollo: Apollo) {
        const idParam = this.activatedRoute.snapshot.params['id'];
        this.modelNameParam = this.activatedRoute.snapshot.params['modelName'];

        const properties$ = this.store
            .select(modelSelectors.getProperties)
            .pipe(map(x => x.map(p => p[this.modelNameParam])));

        this.fields$ = this.store
            .select(modelSelectors.getFormFieldConfigMap)
            .pipe(map(x => x.map(p => p[this.modelNameParam])));

        this.model$ = properties$.pipe(
            fromFilteredSome(),
            mergeMap(p =>
                this.apollo
                    .watchQuery({
                        query: composeByIdQuery(idParam, this.modelNameParam, p),
                        fetchPolicy: 'cache-and-network',
                    })
                    .valueChanges.pipe(bindToOptionData(this.modelNameParam, 'ById'))
            )
        );
    }
}
