import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AmazonconnectService } from '../../../services/amazonconnect.service';
import { SoftPhoneViewModes } from '../../../shared/common';

@Component({
  selector: 'app-incomingcall',
  templateUrl: './incomingcall.component.html',
  styleUrls: ['./incomingcall.component.css']
})
export class IncomingcallComponent implements OnInit {

  @Input() viewMode;
  @Input() incomingContact:any;
  @Output() viewModeChange: EventEmitter<any> = new EventEmitter();

  constructor(private amazonConnectService: AmazonconnectService) { }

  ngOnInit() {
  }
  
  acceptCall() {
    this.amazonConnectService.acceptCall();
    this.viewModeChange.emit(SoftPhoneViewModes.ONCALL);
  }
  
  declineCall() {
    this.amazonConnectService.declineCall();
    this.viewModeChange.emit(SoftPhoneViewModes.AFTERCALL);
  }

}
