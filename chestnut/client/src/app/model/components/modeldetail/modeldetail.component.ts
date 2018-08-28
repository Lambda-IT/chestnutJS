import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ApolloQueryResult } from 'apollo-client';

@Component({
    selector: 'app-modeldetail',
    templateUrl: './modeldetail.component.html',
    styleUrls: ['./modeldetail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModeldetailComponent {
    @Input()
    model: ApolloQueryResult<any>;

    @Input()
    fields: FormlyFieldConfig[];

    @Input()
    modelName: string;

    form = new FormGroup({});

    submit(model: any) {}
}
