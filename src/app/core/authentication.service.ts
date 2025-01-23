import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Author } from '../shared/author/author.model';
import { Token } from './token.model';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { AuthorService } from '../shared/author/author.service';

interface Session {
  id: string;
  author: string;
}

@Injectable()
export class AuthenticationService {

  private url: string = environment.url + 'authenticated';

  token!: Token;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private authorService: AuthorService
  ) { 
    const tokenLS = localStorage.getItem('token');
    if (tokenLS != null) {
      const parsedToken = JSON.parse(tokenLS);
      this.token = new Token(parsedToken['_key'], parsedToken['_idAuthor']);
    }
  }

  login(idAuthor: string): void {
    this.authorService.getAuthor(idAuthor).subscribe(author => {
      const tokenGenerated = this.generateToken();
      this.saveSession(tokenGenerated, author.id).subscribe(response => {
        this.token = new Token(response.id, response.author);
        localStorage.setItem('token', JSON.stringify(this.token));
        this.router.navigate(['/dashboard']);
      });
    });
  }

  logout(): void {
    this.deleteSession().subscribe(response => {
      localStorage.removeItem("token");
      window.location.href = '/login';
    });
  }

  generateToken(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const date = new Date().getTime().toString();

    for (var i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    text += date;

    return text;
  }

  saveSession(tokenGenerated: string, idAuthor: string): Observable<Session> {
    let session: Session = { id: tokenGenerated, author: idAuthor };

    return this.httpClient.post<Session>(this.url, session).pipe(
      catchError(this.handleError)
    );
  }

  deleteSession(): Observable<Object> {
    return this.httpClient.delete(this.url + '/' + this.token.key).pipe(
      catchError(this.handleError)
    );
  }

  handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
    return throwError(errMsg);
  }
}