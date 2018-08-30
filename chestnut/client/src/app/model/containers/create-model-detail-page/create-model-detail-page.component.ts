import { Component, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Option } from 'fp-ts/lib/Option';
import { ActivatedRoute } from '@angular/router';
import { modelSelectors } from '../../state/model.reducer';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Apollo } from 'apollo-angular';

@Component({
    selector: 'app-create-model-detail-page',
    templateUrl: './create-model-detail-page.component.html',
    styleUrls: ['./create-model-detail-page.component.scss'],
})
export class CreateModelDetailPageComponent {
    fields$: Observable<Option<FormlyFieldConfig[]>>;
    data: any;
    title: string;
    submit$ = new EventEmitter<any>();

    constructor(private store: Store<any>, private activatedRoute: ActivatedRoute, private apollo: Apollo) {
        const modelNameParam = this.activatedRoute.snapshot.params['modelName'];
        this.title = `Create ${modelNameParam}`;

        this.fields$ = this.store
            .select(modelSelectors.getFormFieldConfigMap)
            .pipe(map(x => x.map(p => p[modelNameParam])));

        this.data = {};
    }
}
