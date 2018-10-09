import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-userdetail',
  templateUrl: './userdetail.component.html',
  styleUrls: ['./userdetail.component.css']
})
export class UserdetailComponent implements OnInit {

  selectedTab:string = 'history';

  @Input() viewMode;
  @Input() userDetail;

  constructor() { }

  ngOnInit() {
  }

  selectTab(tabName) {
    this.selectedTab = tabName;
  }

}
