import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';
import { ErrorMessagesComponent } from '../../shared/form/error-messages.component';
import { FormValidators } from '../../core/validators/form.validators';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ErrorMessagesComponent
  ],
  templateUrl: './auth.component.html',
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }

    .auth-card {
      width: 100%;
      max-width: 400px;
      margin: 2rem;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .auth-form .mat-form-field {
      width: 100%;
      margin-bottom: 1rem;
    }

    .auth-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1rem;
    }

    .auth-toggle {
      text-align: center;
      margin-top: 1rem;
    }

    .auth-toggle button {
      color: #1976d2;
      text-decoration: underline;
      background: none;
      border: none;
      cursor: pointer;
    }

    .error-message {
      color: #f44336;
      text-align: center;
      margin-top: 1rem;
      padding: 0.5rem;
      background: #ffebee;
      border-radius: 4px;
      font-size: 0.875rem;
    }
  `]
})
export class AuthComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  mode = signal<'login' | 'register'>('login');
  error = signal<string | null>(null);
  hidePassword = signal(true);

  authForm: FormGroup;

  constructor() {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, FormValidators.email()]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['']
    });

    // Add confirm password validator for registration
    this.mode.subscribe(mode => {
      const confirmPasswordControl = this.authForm.get('confirmPassword');
      if (mode === 'register') {
        confirmPasswordControl?.setValidators([
          Validators.required,
          this.confirmPasswordValidator.bind(this)
        ]);
      } else {
        confirmPasswordControl?.clearValidators();
      }
      confirmPasswordControl?.updateValueAndValidity();
    });
  }

  confirmPasswordValidator(control: any) {
    const password = this.authForm?.get('password')?.value;
    return password === control.value ? null : { mismatch: true };
  }

  toggleMode(): void {
    this.mode.set(this.mode() === 'login' ? 'register' : 'login');
    this.error.set(null);
    this.authForm.reset();
  }

  togglePasswordVisibility(): void {
    this.hidePassword.set(!this.hidePassword());
  }

  async onSubmit(): Promise<void> {
    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      return;
    }

    this.error.set(null);
    const { email, password } = this.authForm.value;

    try {
      if (this.mode() === 'login') {
        await this.authService.login(email, password);
      } else {
        await this.authService.register(email, password);
      }

      // Redirect to return URL or dashboard
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
      this.router.navigate([returnUrl]);
    } catch (error: any) {
      this.error.set(error?.message || 'Authentication failed. Please try again.');
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.authForm.get(fieldName);
    return !!(field?.invalid && (field?.dirty || field?.touched));
  }

  getFieldErrorMessage(fieldName: string): string {
    const field = this.authForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return `${fieldName} is required`;
    if (field.errors['email']) return 'Please enter a valid email';
    if (field.errors['minlength']) return `Password must be at least ${field.errors['minlength'].requiredLength} characters`;
    if (field.errors['mismatch']) return 'Passwords do not match';

    return 'Invalid input';
  }
}