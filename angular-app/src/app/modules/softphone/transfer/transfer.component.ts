import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AmazonconnectService } from '../../../services/amazonconnect.service';
import { SoftPhoneViewModes } from '../../../shared/common';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit {

  @Input() viewMode;
  @Input() quickConnectAgents;
  @Input() showQuickConnects;
  @Input() selectedEndpoint;
  @Output() viewModeChange: EventEmitter<any> = new EventEmitter();
  @Output() selectedEndpointChange: EventEmitter<any> = new EventEmitter();

  constructor(private amazonConnectService:AmazonconnectService) { }

  ngOnInit() {
  }

  transferCall() {
    this.amazonConnectService.transferCall(this.selectedEndpoint);
    this.viewModeChange.emit(SoftPhoneViewModes.ONCALL);
  }
    
  changeQuickConnect(endpointName) {
    this.selectedEndpointChange.emit(endpointName);
  }

}
