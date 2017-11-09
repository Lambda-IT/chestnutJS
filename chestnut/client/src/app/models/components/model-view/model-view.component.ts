import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModelDescription } from '../../../../../../common/metadata';
@Component({
    selector: 'model-view',
    templateUrl: 'model-view.component.html',
    styleUrls: ['model-view.scss'],
})
export class ModelViewComponent {
    @Input() modelView: ModelDescription;
    @Input() modelData: any;
    constructor() {}
}
