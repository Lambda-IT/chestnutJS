import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
    selector: 'app-formly-tinymce',
    styleUrls: ['./tinymce.component.scss'],
    template: `
        <mat-label class="label">{{ field.key }}</mat-label>
        <editor
            [inline]="false"
            [init]="{ base_url: 'assets/tinymce', plugins: 'link', height: 400, max_height: 700 }"
            [formControl]="formControl"
        ></editor>
    `,
})
export class FormlyTinyMCEComponent extends FieldType {}
