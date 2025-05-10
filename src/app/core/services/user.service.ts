import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, Observable, of, tap} from 'rxjs';
import {User} from '../models/user';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {UserQuota} from '../models/user-quota';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userSubject = new BehaviorSubject<User | null>(null);
  private quotaSubject = new BehaviorSubject<UserQuota | null>(null);
  user$ = this.userSubject.asObservable();
  quota$ = this.quotaSubject.asObservable();


  constructor(private http: HttpClient) {
  }

  loadQuota() {
    this.http.get<UserQuota>('/api/user/quota')
      .subscribe(q => this.quotaSubject.next(q));
  }

  fetchCurrentUser(): Observable<User> {
    return this.http.get<User>('/api/user/me', {withCredentials: true}).pipe(
      tap(user => this.userSubject.next(user))
    );
  }

  checkAuth(): Observable<boolean> {
    return this.http.get<User>('/api/user/me', { withCredentials: true }).pipe(
      tap(user => this.userSubject.next(user)),
      map(() => true),
      catchError(err => {
        this.userSubject.next(null);
        return of(false);
      })
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
