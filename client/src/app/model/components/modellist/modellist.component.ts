import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { takeUntil, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { fromInput } from '@shared/rxjs-utils';
import { Option } from 'fp-ts/lib/Option';
import { FilterItem, FilterMetadataModel } from '../../types';
import { DestroyableComponent } from '@core/reactive-component/destroyable-component';

@Component({
    selector: 'app-modellist',
    templateUrl: './modellist.component.html',
    styleUrls: ['./modellist.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModellistComponent extends DestroyableComponent {
    @Input() availableColumns: string[];
    @Input() visibleColumns: string[];
    @Input() dataSource: any[];
    @Input() filters: Option<FilterItem[]>;
    @Input() filterMetadata: Observable<FilterMetadataModel>;
    @Output() selectedColumnsChanged = new EventEmitter<string[]>();
    @Output() addFilter = new EventEmitter<FilterItem>();
    @Output() removeFilter = new EventEmitter<FilterItem>();

    private destroying$ = new EventEmitter();
    selectedColumnsForm = new FormControl();
    selectedColumns$: Observable<string[]>;
    columnsToDisplay = ['field', 'operator', 'value', 'remove'];

    constructor() {
        super();
        this.selectedColumnsForm.valueChanges
            .pipe(
                tap(c => this.selectedColumnsChanged.emit(c)),
                takeUntil(this.destroying$)
            )
            .subscribe();

        this.selectedColumns$ = fromInput<ModellistComponent>(this)('visibleColumns').pipe(
            tap(x => this.selectedColumnsForm.setValue(x))
        );
        console.log('FilterItems', this.filters);
    }

    public expandPanel() {
        return this.filters.isSome() && this.filters.map(x => x.length > 0).getOrElse(false);
    }
}
