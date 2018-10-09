import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentcallsComponent } from './agentcalls.component';

describe('AgentcallsComponent', () => {
  let component: AgentcallsComponent;
  let fixture: ComponentFixture<AgentcallsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentcallsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentcallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
