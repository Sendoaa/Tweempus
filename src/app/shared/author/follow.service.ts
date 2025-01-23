import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Follow } from './follow.model'; // Asegúrate de que la ruta sea correcta

@Injectable({
  providedIn: 'root'
})
export class FollowService {

  private apiUrl = 'http://localhost:3000'; // URL del db.json

  constructor(private http: HttpClient) { }

  followUser(followerId: string, followingId: string): Observable<Follow> {
    console.log('followUser - followerId:', followerId, 'followingId:', followingId);
    return this.http.post<Follow>(`${this.apiUrl}/followers`, { followerId, followingId });
  }

  unfollowUser(followerId: string, followingId: string): Observable<void> {
    console.log('unfollowUser - followerId:', followerId, 'followingId:', followingId);
    // La API JSON Server no soporta DELETE con query params, así que necesitamos obtener el ID del seguidor y luego eliminarlo
    return this.http.get<Follow[]>(`${this.apiUrl}/followers?followerId=${followerId}&followingId=${followingId}`)
      .pipe(
        switchMap((follows: Follow[]) => {
          if (follows.length > 0) {
            const followId = follows[0].id;
            return this.http.delete<void>(`${this.apiUrl}/followers/${followId}`);
          } else {
            return new Observable<void>(observer => {
              observer.complete();
            });
          }
        })
      );
  }

  getFollowers(userId: string): Observable<Follow[]> {
    return this.http.get<Follow[]>(`${this.apiUrl}/followers?followingId=${userId}`);
  }

  getFollowing(userId: string): Observable<Follow[]> {
    return this.http.get<Follow[]>(`${this.apiUrl}/followers?followerId=${userId}`);
  }

  getFollowerCount(userId: string): Observable<number> {
    return this.getFollowers(userId).pipe(
      map((followers: Follow[]) => followers.length)
    );
  }
}