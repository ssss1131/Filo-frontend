import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!request.url.startsWith('http')) {
      const apiReq = request.clone({ url: `${request.url}` });
      return next.handle(apiReq);

    }
    return next.handle(request);
  }
}
