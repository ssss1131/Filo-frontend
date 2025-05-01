import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../core/services/auth.service';
import {Router, RouterLink} from '@angular/router';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {passwordMatchValidator} from '../core/validators/password-match.validator';
import {ValidationErrorsComponent} from '../validation-errors/validation-errors.component';
import {NotificationService} from '../core/services/notification.service';
import {RegisterTenantPayload} from '../core/services/register-tenant-payload';

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
    private notify: NotificationService
  ) {
    this.registerForm = this.fb.group({
      displayName: ['', [Validators.required, Validators.minLength(3)]],
      adminUsername: ['', [Validators.required, Validators.minLength(3)]],
      adminPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: passwordMatchValidator });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    const { displayName, adminUsername, adminPassword } = this.registerForm.value;

    const slug = displayName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-]/g, '')
      .replace(/\-+/g, '-');

    const payload: RegisterTenantPayload = {
      slug,
      displayName,
      adminUsername,
      adminPassword
    };

    this.authService.registerTenant(payload).subscribe({
      next: () => {
        this.notify.success(`Company “${displayName}” registered!`);
        this.router.navigate(['/auth/login']);
      },
      error: err => {
        if (err.status === 409) {
          this.notify.error('Slug or username already taken.');
        } else {
          this.notify.error('Unexpected error. Try later.');
        }
      }
    });
  }

}
