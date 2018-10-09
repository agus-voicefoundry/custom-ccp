import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentstatusComponent } from './agentstatus.component';

describe('AgentstatusComponent', () => {
  let component: AgentstatusComponent;
  let fixture: ComponentFixture<AgentstatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentstatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
