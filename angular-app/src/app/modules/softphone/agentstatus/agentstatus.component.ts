import { Component, OnInit, Input } from '@angular/core';
import { AmazonconnectService } from '../../../services/amazonconnect.service';

@Component({
  selector: 'app-agentstatus',
  templateUrl: './agentstatus.component.html',
  styleUrls: ['./agentstatus.component.css'],
  providers: []
})
export class AgentstatusComponent implements OnInit {
  agentStateIcons={
    "routable":"ic_active_20px.svg",
    "offline":"ic_inactive_20px.svg",
    "other":"ic_inactive_20px.svg"
    //TODO: Get other icons?
  }
  showAgentStatusMenu:boolean;

  @Input() viewMode;
  @Input() agentStatus:any;
  @Input() availableAgentStates:any;

  constructor(
    private amazonConnectService: AmazonconnectService
  ) { }

  ngOnInit() {
  }

  changeAgentStatus(newStatus) {
    this.amazonConnectService.setAgentStatus(newStatus);
    this.showAgentStatusMenu = false;
    this.agentStatus = newStatus;
    //TODO: Set ui state?
  }

  openCloseAgentStatusSelection() {
    this.showAgentStatusMenu = !this.showAgentStatusMenu;
  }

}
