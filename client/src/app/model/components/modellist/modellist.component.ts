import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { tap, takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { fromInput } from '@shared/rxjs-utils';

@Component({
    selector: 'app-modellist',
    templateUrl: './modellist.component.html',
    styleUrls: ['./modellist.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModellistComponent implements OnDestroy {
    private destroying$ = new EventEmitter();
    @Input() availableColumns: string[];
    @Input() visibleColumns: string[];
    @Input() dataSource: any[];
    @Output() selectedColumnsChanged = new EventEmitter<string[]>();
    selectedColumnsForm = new FormControl();
    selectedColumns$: Observable<string[]>;

    constructor() {

        this.selectedColumnsForm.valueChanges.pipe(
            tap(c => this.selectedColumnsChanged.emit(c)), takeUntil(this.destroying$)).subscribe();

        this.selectedColumns$ =
            fromInput<ModellistComponent>(this)('visibleColumns').pipe(
                tap(x => this.selectedColumnsForm.setValue(x))
            );
    }

    ngOnDestroy(): void {
        this.destroying$.emit();
    }
}
