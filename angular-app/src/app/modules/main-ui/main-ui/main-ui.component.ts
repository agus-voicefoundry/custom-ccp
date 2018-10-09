import { Component, OnInit } from '@angular/core';
import { AmazonconnectService } from '../../../services/amazonconnect.service';
import { Subscription } from 'rxjs/Subscription';
import { InnerContentViewModes } from '../../../shared/common';

import { AgentService } from '../../../services/agent.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-main-ui',
  templateUrl: './main-ui.component.html',
  styleUrls: ['./main-ui.component.css'],
  providers: [AmazonconnectService, AgentService]
})
export class MainUiComponent implements OnInit {
  viewMode;

  private agentSubscription:Subscription;
  agent:any;
  
  private agentRecentCallsSubscription:Subscription;
  agentRecentCalls:any;

  showSearchPanel:boolean = false;

  constructor(
    private amazonConnectService: AmazonconnectService,
    private agentService: AgentService
  ) {
    this.agentSubscription = this.amazonConnectService.observableAgent
    .subscribe(agent=>{
      this.agent = agent;
      if(agent && !this.agentRecentCalls){
        this.agentService.loadAgentCalls("agus");
      }
    });

    this.agentRecentCallsSubscription = this.agentService.observableAgentRecentCalls
    .subscribe(calls=>{
      this.agentRecentCalls = calls;
    });
  }

  ngOnInit() {
    this.setViewMode(InnerContentViewModes.AGENTHOME);
  }

  setViewMode(viewMode){
    this.viewMode = viewMode;
  }

}