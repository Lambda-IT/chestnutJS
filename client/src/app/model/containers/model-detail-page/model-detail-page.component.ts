import { Component, EventEmitter, OnDestroy, Optional } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { modelSelectors } from '../../state/model.reducer';
import { Observable } from 'rxjs';
import { Option, some, none } from 'fp-ts/lib/Option';
import { mergeMap, map, withLatestFrom, takeUntil, tap } from 'rxjs/operators';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { composeByIdQuery, composeUpdateMutation } from '@shared/graphql';
import { fromFilteredSome } from '@shared/effects-helper';
import { bindToOptionData } from '@shared/bind-functions';
import { filterProperties } from '@shared/helper-functions';
import { Either } from 'decode-ts';
import { left, right } from 'fp-ts/lib/Either';

@Component({
    selector: 'app-model-detail-page',
    templateUrl: './model-detail-page.component.html',
    styleUrls: ['./model-detail-page.component.scss'],
})
export class ModelDetailPageComponent implements OnDestroy {
    private destroying$ = new EventEmitter();

    fields$: Observable<Option<FormlyFieldConfig[]>>;
    model$: Observable<any>;
    modelNameParam: string;
    submit$ = new EventEmitter<any>();
    mutationSuccess$ = new EventEmitter<Either<string, null>>();

    constructor(private store: Store<any>, private activatedRoute: ActivatedRoute, private apollo: Apollo) {
        const idParam = this.activatedRoute.snapshot.params['id'];
        this.modelNameParam = this.activatedRoute.snapshot.params['modelName'];

        const properties$ = this.store.pipe(
            select(modelSelectors.getProperties),
            map(x => x.map(p => p[this.modelNameParam]))
        );

        this.fields$ = this.store.pipe(
            select(modelSelectors.getFormFieldConfigMap),
            map(x => x.map(p => p[this.modelNameParam]))
        );

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

        this.submit$
            .pipe(
                withLatestFrom(properties$.pipe(fromFilteredSome())),
                map(filterProperties),
                mergeMap(p => {
                    const mutation = this.apollo.mutate({
                        mutation: composeUpdateMutation(this.modelNameParam, p),
                        variables: { myData: p },
                        errorPolicy: 'all',
                    });

                    mutation.subscribe(
                        _data => {
                            return this.mutationSuccess$.emit(right(null));
                        },
                        error => {
                            return this.mutationSuccess$.emit(left(error.toString));
                        }
                    );
                    return mutation;
                }),
                takeUntil(this.destroying$)
            )
            .subscribe();
    }

    ngOnDestroy() {
        this.destroying$.emit();
    }
}
