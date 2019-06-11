import { Component, EventEmitter, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Option } from 'fp-ts/lib/Option';
import { ActivatedRoute } from '@angular/router';
import { modelSelectors } from '../../state/model.reducer';
import { map, mergeMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Apollo } from 'apollo-angular';
import { fromFilteredSome } from '@core/rx-helpers';
import { composeCreateMutation } from '@shared/graphql';
import { filterProperties } from '@shared/helper-functions';
import { left, right } from 'fp-ts/lib/Either';
import { Either } from 'decode-ts';

@Component({
    selector: 'app-create-model-detail-page',
    templateUrl: './create-model-detail-page.component.html',
    styleUrls: ['./create-model-detail-page.component.scss'],
})
export class CreateModelDetailPageComponent implements OnDestroy {
    private destroying$ = new EventEmitter();

    fields$: Observable<Option<FormlyFieldConfig[]>>;
    data: any;
    title: string;
    submit$ = new EventEmitter<any>();
    mutationSuccess$ = new EventEmitter<Either<string, null>>();

    constructor(private store: Store<any>, private activatedRoute: ActivatedRoute, private apollo: Apollo) {
        const modelNameParam = this.activatedRoute.snapshot.params['modelName'];
        this.title = `Create ${modelNameParam}`;

        const properties$ = this.store
            .select(modelSelectors.getProperties)
            .pipe(map(x => x.map(p => p[modelNameParam])));

        this.fields$ = this.store
            .select(modelSelectors.getFormFieldConfigMap)
            .pipe(map(x => x.map(p => p[modelNameParam])));

        this.data = {};

        this.submit$
            .pipe(
                withLatestFrom(properties$.pipe(fromFilteredSome())),
                map(filterProperties),
                mergeMap(p =>
                    this.apollo.mutate({
                        mutation: composeCreateMutation(modelNameParam),
                        variables: { input: p },
                    })
                ),
                takeUntil(this.destroying$)
            )
            .subscribe(
                _data => {
                    this.mutationSuccess$.emit(right(null));
                },
                error => {
                    this.mutationSuccess$.emit(left(error.toString));
                }
            );
    }

    ngOnDestroy() {
        this.destroying$.emit();
    }
}
