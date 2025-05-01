import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, Observable, of, tap} from 'rxjs';
import {User} from '../models/user';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {RegisterTenantPayload} from './register-tenant-payload';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
  private baseUrl: string = '/api';


  constructor(private http: HttpClient) {
  }

  fetchCurrentUser(): Observable<User> {
    return this.http.get<User>(this.baseUrl + '/user/me', {withCredentials: true}).pipe(
      tap(user => this.userSubject.next(user))
    );
  }

  checkAuth(): Observable<boolean> {
    return this.http.get<User>(this.baseUrl + '/user/me', {withCredentials: true}).pipe(
      tap(user => this.userSubject.next(user)),
      map(() => true),
      catchError(err => {
        this.userSubject.next(null);
        return of(false);
      })
    );
  }

  login(credentials: { username: string, password: string, tenant:string }): Observable<User> {
    return this.http.post<User>(this.baseUrl + '/auth/login', credentials, {withCredentials: true}).pipe(
      tap(user => this.userSubject.next(user))
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(this.baseUrl + '/auth/logout', {}, {withCredentials: true}).pipe(
      tap(user => this.userSubject.next(null))
    );
  }

  registerTenant(payload: RegisterTenantPayload) {
    return this.http.post(this.baseUrl + '/tenants', payload, {withCredentials: true});
  }
}

