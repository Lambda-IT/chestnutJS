import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DestroyableComponent } from '@core/reactive-component/destroyable-component';
import { FilterItem, FilterMetadataModel, ViewComponent } from '../../types';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { filter, map, startWith, tap, withLatestFrom } from 'rxjs/operators';
import { none, Option, some } from 'fp-ts/lib/Option';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-modellist-filter',
    templateUrl: './modellist-filter.component.html',
    styleUrls: ['./modellist-filter.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModellistFilterComponent extends DestroyableComponent {
    @Input() filterMetadata: Observable<FilterMetadataModel>;
    @Output() addFilter: Observable<FilterItem>;
    @Output() removeFilter = new EventEmitter<FilterItem>();

    applyFilter$ = new EventEmitter<boolean>();
    filterForm: FormGroup;
    columnsToDisplay = ['field', 'operator', 'value', 'remove'];
    ViewComponent = ViewComponent;
    operatorValues = ['gt', 'gte', 'lt', 'lte'];
    filterChange$;

    constructor(private formBuilder: FormBuilder) {
        super();

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
}
