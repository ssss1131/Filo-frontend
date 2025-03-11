import {Component} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {Observable} from 'rxjs';
import {User} from '../core/models/user';
import {AuthService} from '../core/services/auth.service';
import {AsyncPipe, NgIf, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    NgIf,
    AsyncPipe,
    NgOptimizedImage
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  user$: Observable<User | null>;

  constructor(
    private router: Router,
    private authService: AuthService) {
    this.user$ = this.authService.user$;
  }

  ngOnInit(): void {
    this.authService.fetchCurrentUser();
  }

  goToHome() {
    this.router.navigate(['/home']);
  }


  logout() {
    this.authService.logout().subscribe(() =>
      this.router.navigate(['/auth/login'])
    );
  }
}
