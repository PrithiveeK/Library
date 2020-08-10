import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginSignupComponent } from './login-signup/login-signup.component';
import { LoginComponent } from './login-signup/login/login.component';
import { SignupComponent } from './login-signup/signup/signup.component';
import { HomePageComponent } from './home-page/home-page.component';
import { HeaderBarComponent } from './header-bar/header-bar.component';
import { FooterBarComponent } from './footer-bar/footer-bar.component';
import { BookComponent } from './book/book.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { GoogleBooksService } from './google-books.service';
import { ReadBookComponent } from './read-book/read-book.component';
import { LoadingComponent } from './loading/loading.component';
import { MyShelfComponent } from './my-shelf/my-shelf.component';
import { ShelfComponent } from './shelf/shelf.component';
import { PayForBookComponent } from './pay-for-book/pay-for-book.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { ChatComponent } from './chat/chat.component';
import { ChatMessageComponent } from './chat-message/chat-message.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginSignupComponent,
    LoginComponent,
    SignupComponent,
    HomePageComponent,
    HeaderBarComponent,
    FooterBarComponent,
    BookComponent,
    BookDetailComponent,
    ReadBookComponent,
    LoadingComponent,
    MyShelfComponent,
    ShelfComponent,
    PayForBookComponent,
    SearchResultComponent,
    ChatComponent,
    ChatMessageComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [GoogleBooksService],
  bootstrap: [AppComponent]
})
export class AppModule { }
