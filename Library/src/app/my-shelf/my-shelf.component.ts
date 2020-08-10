import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-my-shelf',
  templateUrl: './my-shelf.component.html',
  styleUrls: ['./my-shelf.component.css']
})
export class MyShelfComponent implements OnInit {
  public viewBook = false;

  constructor(
    private  curRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.viewBook = !!this.curRoute.snapshot.paramMap.get("bookID");
  }
  
  openTheBook(bookID: string){
    this.viewBook = true;
    this.router.navigate(['/myshelf',{bookID}])
  }

  closeBook(){
    this.viewBook = false;
  }

}
