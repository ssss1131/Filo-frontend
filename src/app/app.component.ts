import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {UserService} from './core/services/user.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'filo-frontend';

  constructor(private authService: UserService) {
  }

  ngOnInit(): void {
    this.authService.fetchCurrentUser().subscribe();
  }


}
