import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.css']
})

export class LoginSignupComponent implements OnInit {
  public gotoPage = true;
  public isOpen = false;
  constructor() { }

  ngOnInit(): void {
  }

}
