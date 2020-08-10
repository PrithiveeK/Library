import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAccountService } from '../user-account.service';

@Component({
  selector: 'app-header-bar',
  template: `<div class="header-container">
              <h1>LIBRARY</h1>
              <div class="menu-container" tabindex="0">
                  <div class="menu-bar"></div>
                  <ul class="menu-content">
                    <li id="user-name">{{username}}</li>
                    <li (click)="loadPage($event)" id="bookshelf">Home</li>
                    <li (click)="loadPage($event)" id="myshelf">My shelf</li>
                    <li (click)="loadPage($event)" id="login">Logout</li>
                  </ul>
              </div>
            </div>
            <app-chat></app-chat>`,
  styles: [`.header-container{
                  height: 64px;
                  width: 100%;
                  padding: 0 4%;
                  background-color: var(--cover-color);
                  color: var(--pages-color);
                  box-shadow: 0 0 10px black, var(--cover-shadow);
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
              }
              .menu-container{
                  display: flex;
                  flex-direction: column;
                  align-items: flex-end;
                  width: 40px;
                  height: 40px;
                  cursor: pointer;
                  position: relative;
              }
              .menu-container:active{
                  background-color: var(--book-bottom);
              }
              .menu-container:focus > .menu-content{
                display: block;
              }
              .menu-bar{
                margin: auto;
                width: 25px;
                height: 2px;
                background-color: currentColor;
                box-shadow: 0 5px, 0 -5px;
              }
              .menu-content{
                display: none;
                position: absolute;
                top: 75%;
                right: 0;
                padding: 10px;
                background-color: #8a512a;
                z-index: 100;
              }
              #user-name{
                font-weight: 900;
                font-size: 24px;
                overflow-wrap: break-word;
                max-width: 125px;
                line-height: 15px;
                margin-bottom: 10px;
                cursor: default;
              }
              .menu-content > li:not(#user-name):hover {
                text-decoration: underline;
              }
            `],
})
export class HeaderBarComponent implements OnInit {
  public username: string;
  constructor(
    private router: Router,
    private userAcc: UserAccountService,
  ) { }

  ngOnInit(): void {
    this.userAcc.getCurrentUser().subscribe(data=>{
      this.username = data.username;
    })
  }
  loadPage(event){
    this.router.navigate(['/'+event.target.id]);
  }
}
