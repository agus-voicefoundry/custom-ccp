import { Component, OnInit } from '@angular/core';
import { AmazonconnectService, IncomingContact } from '../../../services/amazonconnect.service';
import { SoftPhoneViewModes } from '../../../shared/common';
import { Subscription } from 'rxjs/Subscription';
import * as $ from 'jquery';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: []
})
export class HeaderComponent implements OnInit {

  constructor() {}
  
   ngOnInit() {

  }

}
