import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AmazonconnectService } from '../../../services/amazonconnect.service';
import { SoftPhoneViewModes } from '../../../shared/common';

@Component({
  selector: 'app-aftercall',
  templateUrl: './aftercall.component.html',
  styleUrls: ['./aftercall.component.css']
})
export class AftercallComponent implements OnInit {

  @Input() viewMode;

  constructor(private amazonConnectService:AmazonconnectService) { }

  ngOnInit() {
  }

  setAsAvailable(){
    this.amazonConnectService.setAgentStatus('available');
  }

}
