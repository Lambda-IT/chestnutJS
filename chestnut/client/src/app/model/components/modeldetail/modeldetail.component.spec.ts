import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeldetailComponent } from './modeldetail.component';

describe('ModeldetailComponent', () => {
  let component: ModeldetailComponent;
  let fixture: ComponentFixture<ModeldetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModeldetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModeldetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
