import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleBooksService } from '../google-books.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css','../login-signup/login-signup.component.css']
})
export class BookDetailComponent implements OnInit {
  @Output() public closeBook = new EventEmitter()
  public isOpen = false;
  public msg = {is: false,done: true , message:""};
  public bookDetail = {
    id: "",
    title: "",
    description: "",
    author: "",
    publisher: "",
    published_date: "",
    ISBN: "",
    generes: [],
    isTR: false
  };

  constructor(
    private location: Location,
    private curRouter: ActivatedRoute,
    private gbServices: GoogleBooksService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const bookID = this.curRouter.snapshot.paramMap.get("bookID");
    this.gbServices.getOneBookData(bookID).subscribe(data=>{
      this.bookDetail = data;
    });
  }

  closeTheBook(){
    this.location.back();
    this.closeBook.emit();
  }

  addBook(){
    this.gbServices.postShelfBooks('tr',this.bookDetail.id).subscribe(data=>{
      if(data.ok){
        this.msg = {is: true,done: true, message: "Added book to wishlish"};
        this.bookDetail.isTR = true;
      } else{
        this.msg = {is: true,done: false, message: "Sorry, something went wrong"};
      }
      setTimeout(()=>{
        this.msg = {is: false,done: true, message: ""};
      },2000)
    })
  }

  readBook(){
    this.gbServices.postShelfBooks('cr', this.bookDetail.id).subscribe(data=>{
      console.log(data);
    })
    this.router.navigate([`/bookshelf/${this.bookDetail.ISBN}`]);
  }
  buyBook(){
    this.router.navigate([`/pay/${this.bookDetail.ISBN}`]);
  }
}
