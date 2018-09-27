import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { tap, merge } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { fromInput } from '@shared/rxjs-utils';

@Component({
    selector: 'app-modellist',
    templateUrl: './modellist.component.html',
    styleUrls: ['./modellist.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModellistComponent {
    @Input() availableColumns: string[];
    @Input() visibleColumns: string[];
    @Input() dataSource: any[];
    @Output() selectedColumnsChanged = new EventEmitter<string[]>();
    selectedColumnsForm = new FormControl();
    fromVisibleColumns$: Observable<string[]>;
    selectedColumns$: Observable<string[]>;

    constructor() {
        this.fromVisibleColumns$ = fromInput<ModellistComponent>(this)('visibleColumns').pipe(
            tap(x => this.selectedColumnsForm.setValue(x))
        );
        this.selectedColumns$ = this.fromVisibleColumns$.pipe(
            merge(this.selectedColumnsForm.valueChanges.pipe(
                tap(c => this.selectedColumnsChanged.emit(c)))
            )
        );
    }
}
