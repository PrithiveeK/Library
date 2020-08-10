import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginSignupComponent } from './login-signup/login-signup.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ReadBookComponent } from './read-book/read-book.component';
import { MyShelfComponent } from './my-shelf/my-shelf.component';
import { PayForBookComponent } from './pay-for-book/pay-for-book.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: 'login', component: LoginSignupComponent},
  { path: 'bookshelf', component: HomePageComponent},
  { path: 'bookshelf/:bookno', component: ReadBookComponent},
  { path: 'pay/:bookno', component: PayForBookComponent},
  { path: 'myshelf', component: MyShelfComponent}
];

@NgModule({
  imports: [RouterModule,RouterModule.forRoot(routes)],
  exports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppRoutingModule { }
