import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: '<div class="loading">----------------<div class="hand">&#x261e;</div></div>',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
