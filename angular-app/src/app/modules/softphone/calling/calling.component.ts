import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AmazonconnectService } from '../../../services/amazonconnect.service';
import { SoftPhoneViewModes } from '../../../shared/common';

@Component({
  selector: 'app-calling',
  templateUrl: './calling.component.html',
  styleUrls: ['./calling.component.css']
})
export class CallingComponent implements OnInit {

  @Input() viewMode:string;
  @Input() outboundNumber:string;
  @Output() viewModeChange: EventEmitter<string> = new EventEmitter();

  constructor(private amazonConnectService:AmazonconnectService) { }

  ngOnInit() {
  }

  cancelCall() {
    this.amazonConnectService.cancelCall();
    this.viewModeChange.emit(SoftPhoneViewModes.INACTIVE);
  }

}
