import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Observable} from 'rxjs';
import {User} from '../core/models/user';
import {AuthService} from '../core/services/auth.service';
import {AsyncPipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    NgIf,
    AsyncPipe
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  user$: Observable<User | null>;

  constructor(private authService: AuthService) {
    this.user$ = this.authService.user$;
  }

  ngOnInit(): void {
    this.authService.fetchCurrentUser();
  }
}
