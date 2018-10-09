import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AmazonconnectService } from '../../../services/amazonconnect.service';

@Component({
  selector: 'app-usersearch',
  templateUrl: './usersearch.component.html',
  styleUrls: ['./usersearch.component.css']
})
export class UsersearchComponent implements OnInit {

  @Input() viewMode;
  @Input() users;

  userName:string = "";
  @Output() startCustomerSearch = new EventEmitter<string>();
  @Output() startViewCustomerDetail = new EventEmitter<string>();

  constructor(private amazonConnectService: AmazonconnectService) { }

  ngOnInit() {
  }

  callCustomerSearch(){
    if (this.userName) {
      this.startCustomerSearch.emit(this.userName);
    }
  }

  callViewCustomerDetail(userId:string){
    this.startViewCustomerDetail.emit(userId);
  }

  placeCall(numberToDial){
    this.amazonConnectService.placeCall(numberToDial);
  }

}
