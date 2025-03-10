import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {User} from '../models/user';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();


  constructor(private http: HttpClient) {
  }

  fetchCurrentUser(): Observable<User> {
    return this.http.get<User>('/api/user/me', {withCredentials: true}).pipe(
      tap(user => this.userSubject.next(user))
    );
  }

  login(credentials: { username: string, password: string }): Observable<User> {
    return this.http.post<User>('/api/auth/login', credentials, {withCredentials: true}).pipe(
      tap(user => this.userSubject.next(user))
    );
  }

  register(credentials: { username: string, password: string }): Observable<User> {
    return this.http.post<User>('/api/auth/register', credentials, {withCredentials: true}).pipe(
      tap(user => this.userSubject.next(user))
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>('/api/auth/logout', {}, {withCredentials:true}).pipe(
      tap(user => this.userSubject.next(null))
    );
  }

}
