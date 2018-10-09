import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InnercontentComponent } from './innercontent.component';

describe('InnercontentComponent', () => {
  let component: InnercontentComponent;
  let fixture: ComponentFixture<InnercontentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InnercontentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InnercontentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
