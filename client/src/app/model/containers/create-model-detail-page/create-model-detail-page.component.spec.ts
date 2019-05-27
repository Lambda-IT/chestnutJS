import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateModelDetailPageComponent } from './create-model-detail-page.component';

describe('CreateModelDetailPageComponent', () => {
    let component: CreateModelDetailPageComponent;
    let fixture: ComponentFixture<CreateModelDetailPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CreateModelDetailPageComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateModelDetailPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
