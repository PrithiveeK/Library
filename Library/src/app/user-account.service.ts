import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserAccountService {

  constructor(private http: HttpClient) { }

  public postLogin(data: any): Observable<any> {
    const loginUser = {email:data.userEmail,password:data.userPassword}
    return this.http.post<any>('http://localhost:8000/api/user/login/',loginUser);
  }
  public postSignup(data: any): Observable<any> {
    const signupUser = {username:data.newUserName,email:data.newUserEmail,password:data.createNewPassword}
    return this.http.post<any>('http://localhost:8000/api/user/signup/',signupUser);
  }
  public getCurrentUser(): Observable<any> {
    return this.http.get('http://localhost:8000/api/user/one/?u='+localStorage.getItem("liu"));
  }
  public getAllUser(): Observable<any> {
    const curUser = localStorage.getItem("liu");
    return this.http.get('http://localhost:8000/api/user/all/?u='+curUser);
  }
}
