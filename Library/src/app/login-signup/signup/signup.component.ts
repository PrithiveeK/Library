import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { UserAccountService } from 'src/app/user-account.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../login-signup.component.css']
})
export class SignupComponent implements OnInit {
  public error = "";
  signupDetails : FormGroup;
  constructor(
    private fb : FormBuilder,
    private user : UserAccountService,
    private router : Router
  ) { }

  ngOnInit(): void {
    this.signupDetails = this.fb.group({
      newUserName: ['',[Validators.required,Validators.minLength(5),Validators.pattern('^[a-zA-Z][a-zA-Z0-9]+')]],
      newUserEmail: ['',[Validators.required,Validators.email]],
      createNewPassword: ['',[Validators.required,Validators.minLength(8)]],
      confirmNewPassword: ['',[Validators.required]] 
    }, { validators: function(control: AbstractControl): { [key: string]: boolean} | null{
        const pass = control.get('createNewPassword');
        const confirmPass = control.get('confirmNewPassword');
        if(pass.pristine || confirmPass.pristine)
        return null;
        return (pass && confirmPass && pass.value !== confirmPass.value) ? { 'misMatch': true} : null;
      }
    });
  }


  get userName(){
    return this.signupDetails.get('newUserName');
  }
  get userEmail(){
    return this.signupDetails.get('newUserEmail');
  }
  get newPassword(){
    return this.signupDetails.get('createNewPassword');
  }
  get confirmPassword(){
    return this.signupDetails.get('confirmNewPassword');
  }
  
  signup(event){
    event.preventDefault();
    this.user.postSignup(this.signupDetails.value).subscribe(data=>{
      if(data.ok){
        localStorage.setItem("liu",data.id)
        this.error = "";
        this.router.navigate(['/bookshelf']);
      } else{
        this.error = "Account already exists";
      }
    })
  }

}
