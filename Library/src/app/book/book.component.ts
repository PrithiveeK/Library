import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-book',
  template: `<div id='{{bookId}}' class="book"><p class="book-title">{{ bookTitle }}</p></div>`,
  styles: [`.book{
              margin: .4em;
              width: fit-content;
              height: 30em;
              background-color: #5a2e1e;
              border-radius: 1em 1em 1em 1em;
              padding: 1em;
              cursor: pointer;
            }
            .book-title{
              pointer-events: none;
              margin: 0;
              font-size: 2em;
              height: 100%;
              width: 100%;
              writing-mode: vertical-rl;
              transform: rotateZ(180deg);
              text-align: center;
              color: var(--book-bottom  );
            }`]
})
export class BookComponent implements OnInit {
  @Input() public bookTitle;
  @Input() public bookId;
  constructor() { }

  ngOnInit(): void {
  }

}
