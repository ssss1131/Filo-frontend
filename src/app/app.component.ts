import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {AuthService} from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'filo-frontend';

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.fetchCurrentUser().subscribe();
  }


}
