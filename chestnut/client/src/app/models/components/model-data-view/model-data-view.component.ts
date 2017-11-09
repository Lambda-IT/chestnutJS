import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModelDescription, PropertyDescription } from '../../../../../../common/metadata';
@Component({
    selector: 'model-data-view',
    templateUrl: 'model-data-view.component.html',
    styleUrls: ['model-data-view.scss'],
})
export class ModelDataViewComponent {
    @Input() modelView: ModelDescription;
    @Input() modelData: {};
    constructor() {}
}
