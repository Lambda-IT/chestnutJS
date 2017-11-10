import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModelDescription, PropertyDescription } from '../../../../../../common/metadata';
import { ReactiveComponent } from '../../../shared/reactive-component';
import { Observable } from 'rxjs/Observable';
import { filter, map, publishReplay, refCount } from 'rxjs/operators';
@Component({
    selector: 'model-data-view',
    templateUrl: 'model-data-view.component.html',
    styleUrls: ['model-data-view.scss'],
})
export class ModelDataViewComponent extends ReactiveComponent implements OnInit {
    form$: Observable<FormGroup>;
    formConfig$: Observable<FormGroup>;
    @Input() modelView: ModelDescription;
    @Input() formConfig: FormGroup;
    @Output() saveChanges$ = new EventEmitter();

    constructor(private formBuilder: FormBuilder) {
        super();
        this.formConfig$ = this.observePropertyCurrentValue<FormGroup>('formConfig').pipe(filter(x => !!x));
        this.form$ = this.formConfig$.pipe(map(x => this.formBuilder.group(x)), publishReplay(1), refCount());
    }

    ngOnInit(): void {}
}
