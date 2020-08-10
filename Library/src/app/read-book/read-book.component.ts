import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { GoogleBooksService } from '../google-books.service';

@Component({
  selector: 'app-read-book',
  template: ` <app-header-bar></app-header-bar>
              <iframe [src]="bookLink"></iframe>`,
  styleUrls: []
})
export class ReadBookComponent implements OnInit {
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
    return `https://books.google.com.hk/books?id=${id}&lpg=PP1&pg=PP1&output=embed`
  }

}
