import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as $ from 'jquery';
declare var connect;

export class IncomingContact{
  phoneNumber:string;
}

@Injectable()
export class AmazonconnectService {

  updatedAgent:any;
  connectedContact:any;

  private agent: any;
  observableAgent:BehaviorSubject<any>;

  private availableAgentStates:any;
  observableAgentStates:BehaviorSubject<any>;

  private agentEndpoints:any;
  observableAgentEndpoints:BehaviorSubject<any>;

  //incoming contact info
  private incomingContact:IncomingContact;
  observableIncomingContact:BehaviorSubject<IncomingContact>;

  constructor() {
    this.agent;
    this.observableAgent = new BehaviorSubject<any>(this.updatedAgent);
    this.incomingContact = new IncomingContact();
    this.observableIncomingContact = new BehaviorSubject<IncomingContact>(this.incomingContact);
    this.availableAgentStates = {};
    this.observableAgentStates = new BehaviorSubject<any>(this.availableAgentStates);
    this.agentEndpoints = {};
    this.observableAgentEndpoints = new BehaviorSubject<any>(this.agentEndpoints);
  }

  eventChange() {
    this.observableIncomingContact.next(this.incomingContact);
    this.observableAgentStates.next(this.availableAgentStates);
    this.observableAgent.next(this.updatedAgent);
    this.observableAgentEndpoints.next(this.agentEndpoints);
  }

  async initConnect(containerDiv){
    connect.core.initCCP(containerDiv, {
    //   ccpUrl: "https://datastreaming-test.awsapps.com/connect/ccp#/",
      ccpUrl: "https://waterfield.awsapps.com/connect/ccp#/",
      loginPopup: true
    });

    connect.agent((agent) => {
      this.agent = agent;
      this.updatedAgent = agent;

      console.log("connect.agent");
      
      if (agent) {
        this.getAgentQuickConnects();
        this.setAgentCallbacks();
        this.getAgentStates(agent);
      }

    });

    connect.contact((contact) =>{
      
      this.connectedContact = contact;

      console.log("connect.contact");
      
      //console.log(contact);
      
      contact.onRefresh((contact) =>{
      
        console.log("contact.onRefresh");
        
        let attributeMap = contact.getAttributes();
        
        console.log(attributeMap);
      });
      
      contact.onConnecting((contact) =>{
        if (contact.isInbound()) {	
          console.log("connect.onConnecting (inbound)");

          let connection = contact.getActiveInitialConnection();
          let address = connection.getAddress();
          let phoneNumber = address.stripPhoneNumber();
          console.log('Incoming number: ' + phoneNumber);

          this.incomingContact = new IncomingContact();
          this.incomingContact.phoneNumber = phoneNumber;
          this.eventChange();

        } else {

          console.log("connect.onConnecting (outbound)");
        }

      });
      
      contact.onConnected(function() {
        console.log("contact.onConnected");
      });
      
      contact.onIncoming(function(contact) {
        console.log("contact.onIncoming");
      });
      
      contact.onAccepted(function(contact) {
        console.log("contact.onAccepted");
      });
      
      contact.onEnded(function(contact) {
        console.log("contact.onEnded");

        this.clearIncomingContact();
        
        console.log(contact);
      });
    });

  }

  clearIncomingContact(){
    this.incomingContact = new IncomingContact();
    this.eventChange();
  }

  getAgentStates(agent){
    console.log('getting agent states...');
    this.availableAgentStates = agent.getAgentStates();
    this.eventChange();
  }

  getAgentQuickConnects(){
    console.log('getting quickconnect agents...');
    let queues = this.agent.getRoutingProfile().queues;
    this.agent.getEndpoints(
      queues[0].queueARN,
      {
        success: (data) =>{
          
          console.log('agent.getEndpoints success');
          console.log(data.addresses);
          
          this.agentEndpoints = data.addresses;
        },
        failure: (err, data) => {
          console.log('agent.getEndpoints failure');
        }
      }
    )
  }

  setAgentCallbacks(){

  this.agent.onRefresh((agent) =>{
  
    this.updatedAgent = agent;
    this.eventChange();
    
    //console.log(agent);
    
    //console.log(updatedAgent.getRoutingProfile());
    
    //console.log("agent.onRefresh");
    
    //let agentState = agent.getState();
    
    //console.log("agent state: " + agentState.name);
  });
  
  this.agent.onRoutable((agent) =>{
    console.log("agent.onRoutable");
  });
  
  this.agent.onNotRoutable((agent) =>{
    console.log("agent.onNotRoutable");
  });
  
  this.agent.onOffline((agent) =>{
    console.log("agent.onOffline");
  });
  
  this.agent.onAfterCallWork((agent) =>{
    console.log("agent.onAfterCallWork");
  });
  
  this.agent.onError((agent) =>{
    console.log("agent.onError");
  });
  }

  placeCall(numberToCall){
    if (this.updatedAgent) {
      
      numberToCall = "+1" + numberToCall;
      let endpoint = connect.Endpoint.byPhoneNumber(numberToCall);
      
      this.updatedAgent.connect(endpoint, {
         success: function() {
           console.log("agent.connect success");
         },
         failure: function() {
           console.log("agent.connect failure");
         }
      });
    }
  }

  transferCall(selectedEndpoint){
    if (this.connectedContact) {
      
      let endpointToTransfer;
      for (let i = 0; i < this.agentEndpoints.length; i++) {
        
        
        if (selectedEndpoint == this.agentEndpoints[i].name) {
          endpointToTransfer = this.agentEndpoints[i];
          break;
        }
      }
    
      if (endpointToTransfer) {
        
        this.connectedContact.addConnection(endpointToTransfer,
        {
           success: function() {
            console.log("contact.addConnection success");
            
              //TOOD: Handle these UI states
              $('#holdLabel').html('Holding');
              $('#holdButton').css('background-color', '#b3b3b3');
              $('#holdIcon').attr('src', 'assets/softphone_icons/ic_phone_hold_active_24px.svg');
           },
           failure: function() {
            console.log("contact.addConnection failure");
           }
        });	
      }
    }
  }

  cancelCall() {
  
    if (this.connectedContact) {
        
      this.connectedContact.getAgentConnection().destroy({
         success: ()=> {
            console.log("connection.destroy success");
         },
         failure: ()=> {
            console.log("connection.destroy failure");
         }
      });
    }
  }

  acceptCall() {
    
    if (this.connectedContact) {
    
      this.connectedContact.accept({
         success: ()=> {
          this.eventChange();
         },
         failure: ()=> {
         }
      });
    }
  }

  holdCall() {
  
    if (this.connectedContact) {
        
      let conn = this.connectedContact.getActiveInitialConnection();
      
      if (conn) {
      
        if (!conn.isOnHold()) {
          
          conn.hold({
             success: function() {
               console.log("connection.hold success");
               
               $('#holdLabel').html('Holding');
               $('#holdButton').css('background-color', '#b3b3b3');
               $('#holdIcon').attr('src', 'assets/softphone_icons/ic_phone_hold_active_24px.svg');
             },
             failure: function() {
               console.log("connection.hold failure");
             }
          });
          
        } else {
          
          conn.resume({
             success: function() {
               console.log("connection.resume success");
               
               $('#holdLabel').html('Hold');
               $('#holdButton').css('background-color', '#e4e4e4');
               $('#holdIcon').attr('src', 'assets/softphone_icons/ic_phone_hold_inactive_24px.svg');
             },
             failure: function() {
               console.log("connection.resume failure");
             }
          });
        }	
      }
    }
  }

  declineCall() {
    this.clearIncomingContact();
  
    if (this.connectedContact) {
    
      let conn = this.connectedContact.getActiveInitialConnection();
      
      if (conn) {
        
        conn.destroy({
           success: ()=> {
             console.log("activeInitialConnection.destroy success");
           },
           failure: ()=> {
             console.log("activeInitialConnection.destroy failure");
           }
        });
      }
    }
  }

  setAgentStatus(statusToSet) {
    if (this.updatedAgent) {
      let routableState = this.availableAgentStates.filter(function(state) {
          return state.name === statusToSet;
        })[0];
      
      this.updatedAgent.setState(routableState, {
          success: ()=> {
          },
          failure: ()=> {
          }
      });	
    }
  }

  getAgentStatus(){
    return this.updatedAgent.state;
  }

}
