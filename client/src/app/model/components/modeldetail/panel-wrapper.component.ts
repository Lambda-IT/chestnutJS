import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
    selector: 'app-panel-wrapper',
    templateUrl: './panel-wrapper.component.html',
    styleUrls: ['./panel-wrapper.component.scss'],
})
export class PanelWrapperComponent extends FieldWrapper {
    @ViewChild('fieldComponent', { read: ViewContainerRef }) fieldComponent: ViewContainerRef;
}
