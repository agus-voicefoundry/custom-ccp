import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AftercallComponent } from './aftercall.component';

describe('AftercallComponent', () => {
  let component: AftercallComponent;
  let fixture: ComponentFixture<AftercallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AftercallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AftercallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
