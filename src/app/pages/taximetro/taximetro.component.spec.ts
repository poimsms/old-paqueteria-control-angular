import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaximetroComponent } from './taximetro.component';

describe('TaximetroComponent', () => {
  let component: TaximetroComponent;
  let fixture: ComponentFixture<TaximetroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaximetroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaximetroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
