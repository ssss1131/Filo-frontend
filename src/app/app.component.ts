import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {UserService} from './core/services/user.service';
import {LanguageService} from './core/services/language.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'filo-frontend';

  constructor(
    private authService: UserService,
    private languageService: LanguageService
  ) {
  }

  ngOnInit(): void {
    this.authService.fetchCurrentUser().subscribe();
  }


}
