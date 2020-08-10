import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GoogleBooksService } from '../google-books.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {
  @Output() public viewBook = new EventEmitter<string>();
  public books = [];
  public filterT: boolean = true;
  public filterA: boolean = true;
  public filterP: boolean = true;
  public filterD: boolean = true;
  constructor(
    private route: ActivatedRoute,
    private gb: GoogleBooksService
  ) { }

  ngOnInit(): void {
    this.getBooks();
  }
  getBooks(): void {
    const query = this.route.snapshot.paramMap.get("query");
    const filters = [this.filterT, this.filterA, this.filterP, this.filterD]
    this.gb.filterBooks(query,filters).subscribe(data=>{
      this.books = data;
    })
  }
  showBook(event){
    this.viewBook.emit(event.target.id);
  }

}
