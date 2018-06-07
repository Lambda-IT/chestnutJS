import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    OnDestroy,
    OnChanges,
    ViewChild,
    AfterViewInit,
} from '@angular/core';
import { ModelDescription, PropertyDescription } from '../../../../../../common/metadata';
import { MatTableDataSource, MatSort } from '@angular/material';
import { sortBy } from 'lodash';
@Component({
    selector: 'model-view',
    templateUrl: 'model-view.component.html',
    styleUrls: ['model-view.scss'],
})
export class ModelViewComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
    @Input() modelView: ModelDescription;
    @Input() modelData: any;
    @Output() setColumnVisibleClicked = new EventEmitter();

    propColumns: string[];
    tableData;

    @ViewChild(MatSort) sort: MatSort;

    setColumnVisible(propertyName: string) {
        this.setColumnVisibleClicked.emit(propertyName);
    }

    constructor() {}
    ngOnInit(): void {
        // this. modelView.properties = sortBy(this.modelView.properties, p => p.name);
        this.tableData = new MatTableDataSource(this.modelData);
        this.loadPropColumns();
    }

    ngAfterViewInit() {
        this.tableData.sort = this.sort;
    }
    ngOnDestroy(): void {}

    ngOnChanges() {
        console.log('onchange');
        this.loadPropColumns();
    }

    loadPropColumns() {
        this.propColumns = sortBy(this.modelView.properties, p => p.name)
            .filter(p => !p.hidden)
            .map(p => p.name);
    }
}
