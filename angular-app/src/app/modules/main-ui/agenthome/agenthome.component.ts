import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-agenthome',
  templateUrl: './agenthome.component.html',
  styleUrls: ['./agenthome.component.css']
})
export class AgenthomeComponent implements OnInit {

  @Input() viewMode;
  @Input() agentRecentCalls;

  constructor() { }

  ngOnInit() {
  }

}
