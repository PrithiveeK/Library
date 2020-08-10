import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoogleBooksService } from '../google-books.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-pay-for-book',
  template: ` <app-header-bar></app-header-bar>
              <iframe [src]="bookLink"></iframe>`,
  styleUrls: []
})
export class PayForBookComponent implements OnInit {

  public bookLink: any;
  public bookNo: any;
  public bookId: any;
  constructor(private route: ActivatedRoute,
              private gbService: GoogleBooksService,
              private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.bookNo = this.route.snapshot.paramMap.get('bookno');
    this.gbService.getGoogleBooksApi(this.bookNo).subscribe(data => {
      this.bookLink = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.getUrl(data.items[0].id)
      );
    });
  }

  getUrl(id){
    return `http://localhost:8000/paytm/pay/?user=${localStorage.getItem("liu")}&&book=${id}`;
  }

}
