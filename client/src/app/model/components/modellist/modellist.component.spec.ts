import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModellistComponent } from './modellist.component';

describe('ModellistComponent', () => {
  let component: ModellistComponent;
  let fixture: ComponentFixture<ModellistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModellistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModellistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
