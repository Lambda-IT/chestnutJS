import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { filter, map, startWith, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { fromInput } from '@shared/rxjs-utils';
import { none, Option, some } from 'fp-ts/lib/Option';
import { FilterItem, FilterMetadataModel, ViewComponent } from '../../types';
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
    @Input() filterItems$: Option<FilterItem[]>;
    @Input() filterMetadata: Observable<FilterMetadataModel>;
    @Output() selectedColumnsChanged = new EventEmitter<string[]>();
    @Output() addFilter: Observable<FilterItem>;
    @Output() removeFilter = new EventEmitter<FilterItem>();

    private destroying$ = new EventEmitter();
    selectedColumnsForm = new FormControl();
    selectedColumns$: Observable<string[]>;
    applyFilter$ = new EventEmitter<boolean>();
    filterForm: FormGroup;
    columnsToDisplay = ['field', 'operator', 'value', 'remove'];
    filterChange$;
    ViewComponent = ViewComponent;

    operatorValues = ['gt', 'gte', 'lt', 'lte'];

    constructor(private formBuilder: FormBuilder) {
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

        this.filterForm = this.formBuilder.group({
            field: ['', Validators.required],
            operator: ['', Validators.required],
            value: ['', Validators.required],
        });

        this.filterChange$ = this.filterForm.valueChanges.pipe(
            map(x => some(x.field)),
            startWith(none)
        );

        this.addFilter = this.applyFilter$.pipe(
            filter(() => this.filterForm.valid),
            withLatestFrom(this.filterForm.valueChanges, (_, f) => f),
            map(v => {
                console.log('HaS Operator', v.field);
                return {
                    field: v.field.name,
                    isString: v.field.viewComponent === ViewComponent.stringInput,
                    hasGraphQLOperator: v.field.hasOperator,
                    operator: v.operator,
                    value: v.value,
                };
            }),
            tap(() => this.filterForm.reset())
        );
    }

    public expandPanel() {
        return this.filterItems$.isSome() && this.filterItems$.map(x => x.length > 0).getOrElse(false);
    }
}
