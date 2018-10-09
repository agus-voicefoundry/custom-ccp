import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AgentService {

  private agentRecentCalls:any;
  observableAgentRecentCalls:BehaviorSubject<any>;

  constructor(private http: Http) {
    this.agentRecentCalls;
    this.observableAgentRecentCalls = new BehaviorSubject<any>(this.agentRecentCalls);
   }

  loadAgentCalls(agentId: string) {
    if(!this.agentRecentCalls){
      let agentURL = "https://utils.qualityconnex.com/vf.api.connectdemo/customer/getcallsbyagent?agentId="+agentId;
      let headers = new Headers({});
      let options = new RequestOptions({ headers: headers });

      this.http.get(agentURL, options).subscribe(calls=>{
        console.log(JSON.parse(calls['_body']));
        this.agentRecentCalls = JSON.parse(calls['_body']).calls;
        this.observableAgentRecentCalls.next(this.agentRecentCalls);
      });
    }
  }

}