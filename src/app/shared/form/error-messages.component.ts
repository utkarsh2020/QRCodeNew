import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-error-messages',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="control?.invalid && (control?.dirty || control?.touched)" class="error">
      <div *ngIf="control?.hasError('required')" class="error-message">
        {{ fieldName }} is required
      </div>
      <div *ngIf="control?.hasError('email')" class="error-message">
        Please enter a valid email address
      </div>
      <div *ngIf="control?.hasError('minlength')" class="error-message">
        {{ fieldName }} must be at least {{ control?.getError('minlength')?.requiredLength }} characters
      </div>
      <div *ngIf="control?.hasError('url')" class="error-message">
        Please enter a valid URL (http:// or https://)
      </div>
      <div *ngIf="control?.hasError('phone')" class="error-message">
        Please enter a valid phone number
      </div>
      <div *ngIf="control?.hasError('upiId')" class="error-message">
        Please enter a valid UPI ID (e.g., user@bank)
      </div>
      <div *ngIf="control?.hasError('paypalMe')" class="error-message">
        Please enter a valid PayPal.me URL
      </div>
      <div *ngIf="control?.hasError('positiveNumber')" class="error-message">
        Please enter a positive number
      </div>
      <div *ngIf="control?.hasError('hexColor')" class="error-message">
        Please enter a valid hex color (e.g., #FF0000)
      </div>
      <div *ngIf="control?.hasError('wifiSsid')" class="error-message">
        SSID must be 1-32 characters long
      </div>
      <div *ngIf="control?.hasError('fileSize')" class="error-message">
        File size must be less than {{ control?.getError('fileSize')?.maxSize }}MB
      </div>
      <div *ngIf="control?.hasError('fileType')" class="error-message">
        Invalid file type. Allowed types: {{ control?.getError('fileType')?.allowedTypes?.join(', ') }}
      </div>
    </div>
  `,
  styles: [`
    .error {
      margin-top: 4px;
    }

    .error-message {
      color: #dc2626;
      font-size: 0.875rem;
      line-height: 1.25rem;
    }
  `]
})
export class ErrorMessagesComponent {
  @Input() control: AbstractControl | null = null;
  @Input() fieldName: string = 'Field';
}