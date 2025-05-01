import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../core/services/auth.service';
import {Router, RouterLink} from '@angular/router';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {passwordMatchValidator} from '../core/validators/password-match.validator';
import {ValidationErrorsComponent} from '../validation-errors/validation-errors.component';
import {NotificationService} from '../core/services/notification.service';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ValidationErrorsComponent,
    NgOptimizedImage
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notifyService: NotificationService
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      confirmPassword: ['', [Validators.required]],
    }, {validators: passwordMatchValidator});

  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.notifyService.success("You have successfully registered!")
          this.authService.login({
            username: this.registerForm.value['username'],
            password: this.registerForm.value['password']
          }).subscribe( () => {
              this.router.navigate(['/home']);
          }
          );
        },
        error: err => {
          if (err.status === 400) {
            this.notifyService.error('Invalid data. Please check your inputs.');
          } else if (err.status === 409) {
            this.notifyService.error('Username is already taken.');
          } else {
            this.notifyService.error('An unexpected error occurred. Please try again later.');
          }
        }
      });
    }
  }
}
