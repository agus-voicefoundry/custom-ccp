import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AmazonconnectService } from '../../../services/amazonconnect.service';
import { SoftPhoneViewModes } from '../../../shared/common';

@Component({
  selector: 'app-oncall',
  templateUrl: './oncall.component.html',
  styleUrls: ['./oncall.component.css']
})
export class OncallComponent implements OnInit {

  @Input() viewMode;
  @Output() viewModeChange: EventEmitter<any> = new EventEmitter();

  constructor(private amazonConnectService:AmazonconnectService) { }

  ngOnInit() {
  }
  
  cancelCall() {
    this.amazonConnectService.cancelCall();
    this.viewModeChange.emit(SoftPhoneViewModes.INACTIVE);
  }

}
