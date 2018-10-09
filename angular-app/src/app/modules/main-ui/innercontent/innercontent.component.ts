import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AmazonconnectService, IncomingContact } from '../../../services/amazonconnect.service';
import { UserService } from '../../../services/user.service';
import { InnerContentViewModes } from '../../../shared/common';
import { Subscription } from 'rxjs/Subscription';

import * as $ from 'jquery';

@Component({
  selector: 'app-innercontent',
  templateUrl: './innercontent.component.html',
  styleUrls: ['./innercontent.component.css']
})
export class InnercontentComponent implements OnInit {
  users;
  userDetail;

  //subscriptions
  private usersSubscription:Subscription;
  private userDetailSubscription:Subscription;

  @Input() agentRecentCalls;
  @Input() viewMode;
  @Output() viewModeChange: EventEmitter<any> = new EventEmitter();

  constructor(
    private amazonConnectService: AmazonconnectService,
    private userService: UserService
  ) {}

  ngOnInit() {

    this.usersSubscription = this.userService.observableUsers
    .subscribe(u=>{
      this.users = u;
    });

    this.userDetailSubscription = this.userService.observableUserDetail
    .subscribe(ud=>{
      this.userDetail = ud;
    });
  }

  searchCustomers(userName:string){
    if (userName) {
      this.userService.searchUsers(userName);
      this.viewModeChange.emit(InnerContentViewModes.USERS);
    }
  }

  viewCustomerDetail(userId:string){
    this.viewModeChange.emit(InnerContentViewModes.USERDETAIL);
    this.userService.getUserDetail(userId);
  }
}
