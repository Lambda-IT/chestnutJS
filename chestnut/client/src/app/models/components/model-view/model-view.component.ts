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
        this.tableData = new MatTableDataSource(this.modelData);
        this.propColumns = this.modelView.properties.filter(p => !p.hidden).map(p => p.name);
    }

    ngAfterViewInit() {
        this.tableData.sort = this.sort;
    }
    ngOnDestroy(): void {}

    ngOnChanges() {
        this.propColumns = this.modelView.properties.filter(p => !p.hidden).map(p => p.name);
    }
}
