import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GoogleBooksService } from '../google-books.service';

@Component({
  selector: 'app-shelf',
  templateUrl: './shelf.component.html',
  styleUrls: ['./shelf.component.css']
})
export class ShelfComponent implements OnInit {
  @Output() public openBook = new EventEmitter<string>();
  @Input() public op; 
  public title = "";
  public bookID = "";
  public books = [];
  constructor(
    private gb: GoogleBooksService
  ) { }

  ngOnInit(): void {
    this.title = ["Continue Reading", "To Read", "Read"][this.op];
    this.gb.getShelfBooks(["cr", "tr", "r"][this.op]).subscribe(data=>this.books=data);
  }

  openTheBook(event){
    this.openBook.emit(event.target.id);
  }

}
