import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ValidationErrorsComponent} from '../validation-errors/validation-errors.component';
import {UserService} from '../core/services/user.service';
import {TranslateModule} from '@ngx-translate/core';
import {LanguageService} from '../core/services/language.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    ValidationErrorsComponent,
    TranslateModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: UserService,
    private router: Router,
    public languageService: LanguageService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (user) => {
          this.authService.loadQuota();
          this.router.navigate(['home']);
        },
        error: (err) => {
          if (err.status === 400) {
            this.errorMessage = 'Invalid data. Please check your inputs.';
          } else if (err.status === 401) {
            this.errorMessage = 'Invalid credentials. Please try again.';
          } else {
              this.errorMessage = 'An unexpected error occurred. Please try again later.';
          }
        }
      });
    }
  }

  switchLanguage(lang: string): void {
    this.languageService.setLanguage(lang);
  }
}
