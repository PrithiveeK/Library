import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable(  )
export class GoogleBooksService {
  constructor(private http: HttpClient) {}

  public getGoogleBooksApi(isbn: string): Observable<any> {
    let requestLink = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=AIzaSyAH4EKzZI6NooXKYNkPYGhW7csAPWS-0fk`
    return this.http.get(requestLink);
  }
  public getGoogleBooksData(): Observable<any>{
    return this.http.get('http://localhost:8000/api/book/all/');
  }
  public getOneBookData(bookID: string): Observable<any> {
    return this.http.get(`http://localhost:8000/api/book/one/${bookID}/`);
  }
  public getShelfBooks(option:string): Observable<any> {
    const userID = localStorage.getItem("liu");
    return this.http.get(`http://localhost:8000/api/book/${option}/${userID}/`);
  }
  public postShelfBooks(option: string, bookID: string): Observable<any> {
    const userID = localStorage.getItem("liu");
    const data = {"user_id": userID, "book_id": bookID};
    return this.http.post<any>(`http://localhost:8000/api/book/${option}/${userID}/`, data);
  }
  public filterBooks(query: string,filter:boolean[]): Observable<any> {
    const qp = `?t=${filter[0]?1:0}&&a=${filter[1]?1:0}&&p=${filter[2]?1:0}&&d=${filter[3]?1:0}`
    const data = {"q": query}
    return this.http.post<any>(`http://localhost:8000/api/book/in/${qp}`,data)
  }
}
