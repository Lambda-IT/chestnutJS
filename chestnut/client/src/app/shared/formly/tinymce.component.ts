import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
    selector: 'app-formly-tinymce',
    template: `
        <editor [inline]="true" apiKey="test" [init]="{plugins: 'link'}" [formControl]="formControl" [formlyAttributes]="field"></editor>
    `,
})
export class FormlyTinyMCEComponent extends FieldType { }
