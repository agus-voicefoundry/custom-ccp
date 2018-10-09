import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class UserService {

  private users:any;
  observableUsers:BehaviorSubject<any>;

  private userDetail:any;
  observableUserDetail:BehaviorSubject<any>;

  constructor(private http: Http) {
    this.observableUsers = new BehaviorSubject<any>(this.users);
    this.observableUserDetail = new BehaviorSubject<any>(this.users);
   }

  searchUsers(userName: string) {
    let userURL = "https://utils.qualityconnex.com/vf.api.connectdemo/customer/search?customerName=" + userName;
    let headers = new Headers({});
    let options = new RequestOptions({ headers: headers });

    this.http.get(userURL, options).subscribe(users=>{
      console.log(JSON.parse(users['_body']));
      this.users = JSON.parse(users['_body']).customers;
      this.observableUsers.next(this.users);
    });
  }

  getUserDetail(userID: string){
    let userURL = "https://utils.qualityconnex.com/vf.api.connectdemo/customer/getinfo?customerId=" + userID;
    let headers = new Headers({});
    let options = new RequestOptions({ headers: headers });

    this.http.get(userURL, options).subscribe(user=>{
      console.log(JSON.parse(user['_body']));
      this.userDetail = JSON.parse(user['_body']).user;
      this.observableUserDetail.next(this.userDetail);
    });
  }

}
