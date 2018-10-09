import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { InnerContentViewModes } from '../../../shared/common';

@Component({
  selector: 'app-leftbar',
  templateUrl: './leftbar.component.html',
  styleUrls: ['./leftbar.component.css']
})
export class LeftbarComponent implements OnInit {

  @Output() viewModeChange: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  goHome() {
    this.viewModeChange.emit(InnerContentViewModes.AGENTHOME);
  }

  showSearch() {
    this.viewModeChange.emit(InnerContentViewModes.SEARCH);
  }

}
