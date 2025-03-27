import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AuthService} from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ],
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
