import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AmazonconnectService } from '../../../services/amazonconnect.service';
import { SoftPhoneViewModes } from '../../../shared/common';

@Component({
  selector: 'app-dialpad',
  templateUrl: './dialpad.component.html',
  styleUrls: ['./dialpad.component.css']
})
export class DialpadComponent implements OnInit {

  @Input() viewMode;
  @Input() outboundNumber;
  @Output() viewModeChange: EventEmitter<string> = new EventEmitter();
  @Output() numberToDialChange: EventEmitter<string> = new EventEmitter();

  constructor(private amazonConnectService:AmazonconnectService) { }

  ngOnInit() {
  }

  placeCall() {
    this.amazonConnectService.placeCall(this.outboundNumber);
    this.viewModeChange.emit(SoftPhoneViewModes.CALLING);
  }
    
  clearInputNumber() {
    this.numberToDialChange.emit('');
  }
  
  addInputNumber(number) {
    this.numberToDialChange.emit(this.outboundNumber + number.toString());
  }
}
