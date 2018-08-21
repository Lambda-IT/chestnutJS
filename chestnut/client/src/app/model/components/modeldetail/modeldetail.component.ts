import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Component({
    selector: 'app-modeldetail',
    templateUrl: './modeldetail.component.html',
    styleUrls: ['./modeldetail.component.scss'],
})
export class ModeldetailComponent {
    @Input()
    model: any;
    @Input()
    fields: FormlyFieldConfig[];

    form = new FormGroup({});

    submit(model: any) {}
}
