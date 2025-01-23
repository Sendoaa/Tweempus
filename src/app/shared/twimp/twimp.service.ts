import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Author } from '../author/author.model';
import { Twimp } from './twimp.model';
import { environment } from '../../../environments/environment';

interface DbTwimp {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

@Injectable()
export class TwimpService {

  private url: string = environment.url + 'twimps';
  private urlFavorite: string = environment.url + 'author-favorites';

  constructor(private httpClient: HttpClient) { }

  getTwimps(): Observable<Twimp[]> {
    let twimps: Twimp[] = [];

    return this.httpClient.get<DbTwimp[]>(this.url).pipe(
      map(dbTwimpList => {
        for (let dbTwimp of dbTwimpList) {
          let twimp: Twimp = new Twimp(dbTwimp.id, 'localhost:4200/twimp/' + dbTwimp.id, new Author(dbTwimp.author), dbTwimp.content, dbTwimp.timestamp);
          twimps.push(twimp);
        }
        return twimps;
      }),
      catchError(this.handleError)
    );
  }

  getAuthorTwimps(idAuthor: string): Observable<Twimp[]> {
    let twimps: Twimp[] = [];

    return this.httpClient.get<DbTwimp[]>(this.url).pipe(
      map(dbTwimpList => {
        for (let dbTwimp of dbTwimpList) {
          if (dbTwimp.author === idAuthor) {
            let twimp: Twimp = new Twimp(dbTwimp.id, 'localhost:4200/twimp/' + dbTwimp.id, new Author(dbTwimp.author), dbTwimp.content, dbTwimp.timestamp);
            twimps.push(twimp);
          }
        }
        return twimps;
      }),
      catchError(this.handleError)
    );
  }

  setTwimp(twimp: Twimp): Observable<any> {
    let dbTwimp: any = {
      'id': twimp.id,
      'author': twimp.author.id,
      'by': twimp.author.fullName,
      'content': twimp.content,
      'timestamp': twimp.timestamp
    };

    return this.httpClient.post(this.url, dbTwimp).pipe(
      catchError(this.handleError)
    );
  }

  getFavoritesByAuthor(idAuthor: string, idTwimp: string): Observable<boolean> {
    return this.httpClient.get<{ twimps: string[] }>(this.urlFavorite + '/' + idAuthor).pipe(
      map(response => {
        let favorites: string[] = response.twimps;
        return favorites.indexOf(idTwimp) !== -1;
      }),
      catchError(this.handleError)
    );
  }

  getFavoritesTwimps(idAuthor: string): Observable<string[]> {
    return this.httpClient.get<{ twimps: string[] }>(this.urlFavorite + '/' + idAuthor).pipe(
      map(dbFavorites => dbFavorites.twimps),
      catchError(this.handleError)
    );
  }

  setFavoriteTwimps(idAuthor: string, twimpList: string[]): Observable<any> {
    let dbFavoriteTwimps: any = {
      'id': idAuthor,
      'twimps': twimpList
    };

    return this.httpClient.patch(this.urlFavorite + '/' + idAuthor, dbFavoriteTwimps).pipe(
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