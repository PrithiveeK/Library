import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-footer-bar',
  template: `<div class="footer-container">
                  <div class="zoom-container">
                    <button (click)="zoomIn()" tabindex="0">&#43;&#32;Zoom In</button>
                    <button (click)="zoomOut()" tabindex="0">&#8722;&#32;Zoom Out</button>
                  </div>
                  <form class="search-container" (submit)="searchQuery($event)">
                    <input type="text" name="query" class="search-bar" placeholder="Search here..."/>
                    <button type="submit">
                      <div class="search-submit"></div>
                    </button>
                  </form>
                  <div class="sort-container">
                    <button tabindex="0">
                      <div class="down-arrow"></div>Sort By
                    </button>  
                    <ul class="sortby-list">
                      <li (click)="sortBy(1)"><span 
                          [style.color]="sortbySelected == 1 ? 'black' : '#dfd9d9'">
                              &#10003;</span>Book Title</li>
                      <li (click)="sortBy(2)"><span
                          [style.color]="sortbySelected == 2 ? 'black' : '#dfd9d9'">
                              &#10003;</span>Author Name</li>
                      <li (click)="sortBy(3)"><span
                          [style.color]="sortbySelected == 3 ? 'black' : '#dfd9d9'">
                            &#10003;</span>Published Year</li>
                    </ul>
                  </div>
                </div>
                <div class="search-result" *ngIf="viewSearchResults">
                  <div class="close" (click)="closeSearch()"></div>
                  <app-search-result (viewBook)="viewTheBook($event)"></app-search-result>
                </div>`,
  styleUrls: ['./footer-bar.component.css'],
})
export class FooterBarComponent implements OnInit {
  public sortbySelected = 0;
  public viewSearchResults: boolean = false;
  @Output() public shelfChange = new EventEmitter<number>();
  @Output() public sortBooks = new EventEmitter<number>();
  @Output() public viewBook = new EventEmitter<string>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private loc: Location
  ) { }

  ngOnInit(): void {
    this.viewSearchResults = !!this.route.snapshot.paramMap.get("query");
  }

  searchQuery(event){
    this.viewSearchResults = true;
    const query = event.target[0].value
    if(query)
    this.router.navigate(['/bookshelf',{ query }])
    else
    this.router.navigate(['/bookshelf'])
  }
  closeSearch(){
    this.viewSearchResults = false;
    this.loc.back();
  }
  sortBy(what){
    this.sortbySelected = what;
    this.sortBooks.emit(what);
  }

  zoomIn(){
    this.shelfChange.emit(1);
  }
  zoomOut(){
    this.shelfChange.emit(-1);
  }
  viewTheBook(id){
    this.viewBook.emit(id);
  }
}
