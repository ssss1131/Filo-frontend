import {Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {ServerErrorComponent} from './server-error/server-error.component';
import {LayoutComponent} from './layout/layout.component';

export const routes: Routes = [
  {
    path: 'auth/login',
    component: LoginComponent
  },
  {
    path: 'auth/register',
    component: RegisterComponent
  },
  // {
  //   path: '',
  //   component: LayoutComponent,
  //   // children: [
  //   //   { path: 'home', component: HomeComponent },
  //   //   { path: 'search', component: SearchComponent },
  //   //   // можно добавить редирект, если нужно
  //   //   { path: '', redirectTo: 'home', pathMatch: 'full' }
  //   // ]
  // },
  {
    path: '404',
    component: NotFoundComponent
  },
  {
    path: '500',
    component: ServerErrorComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];
