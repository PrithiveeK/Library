import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { UserAccountService } from '../../user-account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../login-signup.component.css']
})
export class LoginComponent implements OnInit {
  public error = "";
  loginDetails : FormGroup;
  constructor(
    private fb :  FormBuilder,
    private user : UserAccountService,
    private router : Router 
  ) { }

  ngOnInit(): void {
    this.loginDetails = this.fb.group({
      userEmail: ['',[Validators.required,Validators.email]],
      userPassword: ['',[Validators.required,Validators.minLength(8)]],
    });
  }
  get userPassword(){
    return this.loginDetails.get('userPassword');
  }
  get userEmail(){
    return this.loginDetails.get('userEmail');
  }
  login(event){
    event.preventDefault();
    this.user.postLogin(this.loginDetails.value).subscribe(data=>{
      if(data.ok){
        localStorage.setItem("liu",data.id)
        this.error = "";
        this.router.navigate(['/bookshelf'])
      } else{
        this.error = "Invalid Email OR Password";
      }
    })
  }
}
