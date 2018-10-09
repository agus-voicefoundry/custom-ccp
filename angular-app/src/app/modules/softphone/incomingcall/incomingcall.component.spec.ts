import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingcallComponent } from './incomingcall.component';

describe('IncomingcallComponent', () => {
  let component: IncomingcallComponent;
  let fixture: ComponentFixture<IncomingcallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomingcallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomingcallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
