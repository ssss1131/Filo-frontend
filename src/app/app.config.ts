import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {QuotaInterceptor} from './core/interceptors/quota.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: QuotaInterceptor,
      multi: true
    },
    provideHttpClient(withInterceptorsFromDi())]
};
