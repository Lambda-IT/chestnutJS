import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModelDescription, PropertyDescription } from '../../../../../../common/metadata';
@Component({
    selector: 'model-view',
    templateUrl: 'model-view.component.html',
    styleUrls: ['model-view.scss'],
})
export class ModelViewComponent implements OnInit {
    @Input() modelView: ModelDescription;
    @Input() modelData: any;
    @Output() setColumnVisibleClicked = new EventEmitter();

    setColumnVisible(propertyName: string) {
        this.setColumnVisibleClicked.emit(propertyName);
    }

    constructor() {}
    ngOnInit(): void {
        // this.modelView.properties.forEach(x => Object.assign(x, { hidden: false }));
        // console.log('prop', this.modelView.properties);
    }
}
