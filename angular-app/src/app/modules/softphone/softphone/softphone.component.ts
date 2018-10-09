import { Component, OnInit } from '@angular/core';
import { AmazonconnectService, IncomingContact } from '../../../services/amazonconnect.service';
import { SoftPhoneViewModes } from '../../../shared/common';
import { Subscription } from 'rxjs/Subscription';
import * as $ from 'jquery';

@Component({
  selector: 'app-softphone',
  templateUrl: './softphone.component.html',
  styleUrls: ['./softphone.component.css']
})
export class SoftphoneComponent implements OnInit {
  connectAgent:any;

  selectedEndpoint;
  quickConnectAgents;
  
  agentStatus;

  viewMode;

  showAgentStatusMenu:boolean = false;
  showSoftPhone:boolean = false;

  softphoneTransferVisible: boolean = false;
  showQuickConnects: boolean = false;

  outboundNumber = '';

  //subscriptions
  private agentSubscription:Subscription;
  private quickConnectsSubscription:Subscription;
  private incomingContactSubscription:Subscription;
  incomingContact:IncomingContact;
  private agentStatesSubscription:Subscription;
  availableAgentStates:any = new Array();

  constructor(
    private amazonConnectService: AmazonconnectService
  ) {}
  
   ngOnInit() {
    this.setViewMode(SoftPhoneViewModes.INACTIVE);

    this.agentSubscription = this.amazonConnectService.observableAgent
    .subscribe(agent=>{
      this.connectAgent = agent;
      if(agent){
        this.agentStatus = agent.getState();
      }
    });

    this.incomingContactSubscription = this.amazonConnectService.observableIncomingContact
      .subscribe(contact=>{
        this.incomingContact = contact;
        if(contact.phoneNumber && this.viewMode != SoftPhoneViewModes.ONCALL){
          this.showSoftPhone = true;
          this.setViewMode(SoftPhoneViewModes.INCOMING);
        }
      });

      this.agentStatesSubscription = this.amazonConnectService.observableAgentStates
      .subscribe(states=>{
        this.availableAgentStates = states;
      });

      this.quickConnectsSubscription = this.amazonConnectService.observableAgentEndpoints
      .subscribe(qc=>{
        this.quickConnectAgents = qc;
      });
      
      let containerDiv = document.getElementById("containerDiv");
      this.amazonConnectService.initConnect(containerDiv);
  }

  setViewMode(viewMode){
    this.viewMode = viewMode;
  }

  updateOutboundNumber(number){
    this.outboundNumber = number;
  }

  openCloseSoftphone() {
    this.showSoftPhone = !this.showSoftPhone;
    this.setViewMode(SoftPhoneViewModes.INACTIVE);
  }
  
  viewQuickConnects() {
    this.softphoneTransferVisible = !this.softphoneTransferVisible;
  }
  
  openCloseQuickConnectSelection() {
    this.showQuickConnects = !this.showQuickConnects;
  }
  
  changeQuickConnect(endpointName) {
    this.selectedEndpoint = endpointName;
    this.showQuickConnects = false;
  }

  setAsAvailable(){
    this.amazonConnectService.setAgentStatus('available');
  }
  
  holdCall() {
    this.amazonConnectService.holdCall();
  }


}
