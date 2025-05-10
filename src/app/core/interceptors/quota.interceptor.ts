import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable()
export class QuotaInterceptor implements HttpInterceptor {
  constructor(private userService: UserService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      tap(event => {
        if (!(event instanceof HttpResponse)) {
          return;
        }
        const mutating = ['POST', 'DELETE'].includes(req.method);
        const isOurApi = req.url.startsWith('/api/resource');
        if (mutating && isOurApi) {
          this.userService.loadQuota();
        }
      })
    );
  }
}
