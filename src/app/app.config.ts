import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {AuthService} from './core/services/auth.service';
import {ApiInterceptor} from './core/interceptors/api.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    AuthService,
    {provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi:true},
  provideHttpClient(withInterceptorsFromDi())]
};
