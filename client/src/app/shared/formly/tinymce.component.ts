import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
    selector: 'app-formly-tinymce',
    styleUrls: ['./tinymce.component.scss'],
    template: `
            <mat-label class="label">{{field.key}}</mat-label>
            <editor [inline]="true" [init]="{plugins: 'link'}" [formControl]="formControl"></editor>
    `,
})
export class FormlyTinyMCEComponent extends FieldType {}
