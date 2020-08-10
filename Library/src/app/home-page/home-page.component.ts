import { Component, OnInit, ElementRef } from '@angular/core';
import { GoogleBooksService } from '../google-books.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  public viewBook = false;
  public isLoaded = false;
  public shelfSize = 8;
  public books = [];
  
  constructor(
    private eleRef: ElementRef, 
    private gbService: GoogleBooksService,
    private curRoute: ActivatedRoute,
    private router: Router
  ) {
    this.eleRef.nativeElement.style.setProperty("--shelf-size",this.shelfSize);
  }
  
  ngOnInit(): void {
    this.gbService.getGoogleBooksData().subscribe(data => {
      this.books = data;
      this.isLoaded = true;
    });
    this.viewBook = !!this.curRoute.snapshot.paramMap.get("bookID");
  }

  async sortTheBooksBy(what){
    this.isLoaded = false;
    try{
      this.books.sort((a: {},b: {})=>{
        let compare;
        switch(what){
          case 1: compare = a['title'].localeCompare(b['title']);break;
          case 2: compare = a['author'].localeCompare(b['author']);break;
          case 3: compare = Number(a['published_date'].substr(-4)) - 
                            Number(b['published_date'].substr(-4));break;
        }
        return compare;
      });
      this.isLoaded = true;
    }catch(err){
      console.log(err);
    }
  }

  changeShelfSize(size: number){
    if(this.shelfSize+size>=5 && this.shelfSize+size<=15){
      this.shelfSize += size;
      this.eleRef.nativeElement.style.setProperty("--shelf-size",this.shelfSize);
    }
  }
  closeBook(){
    this.viewBook = false;
  }
  viewBookDetail(event){
    this.viewBook = true;
    this.router.navigate(['/bookshelf',{bookID: event.target.id}])
  }
  vBookDetail(id){
    this.viewBook = true;
    this.router.navigate(['/bookshelf',{bookID: id}])
  }
}
