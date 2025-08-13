import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class FormValidators {
  /**
   * Validate URL format
   */
  static url(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      try {
        const url = new URL(control.value);
        return url.protocol === 'http:' || url.protocol === 'https:' ? null : { url: true };
      } catch {
        return { url: true };
      }
    };
  }

  /**
   * Validate email format
   */
  static email(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(control.value) ? null : { email: true };
    };
  }

  /**
   * Validate phone number
   */
  static phone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      return phoneRegex.test(control.value.replace(/\s/g, '')) ? null : { phone: true };
    };
  }

  /**
   * Validate UPI ID
   */
  static upiId(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
      return upiRegex.test(control.value) ? null : { upiId: true };
    };
  }

  /**
   * Validate PayPal.me format
   */
  static paypalMe(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const paypalRegex = /^(https?:\/\/)?paypal\.me\/[a-zA-Z0-9_.-]+$/i;
      return paypalRegex.test(control.value) ? null : { paypalMe: true };
    };
  }

  /**
   * Validate positive number
   */
  static positiveNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const num = parseFloat(control.value);
      return !isNaN(num) && num > 0 ? null : { positiveNumber: true };
    };
  }

  /**
   * Validate hex color
   */
  static hexColor(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      return hexRegex.test(control.value) ? null : { hexColor: true };
    };
  }

  /**
   * Validate Wi-Fi SSID
   */
  static wifiSsid(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      // SSID can be 1-32 characters, no special restrictions
      return control.value.length >= 1 && control.value.length <= 32 ? null : { wifiSsid: true };
    };
  }

  /**
   * Validate file size
   */
  static fileSize(maxSizeInMB: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || !(control.value instanceof File)) return null;

      const file = control.value as File;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

      return file.size <= maxSizeInBytes ? null : { 
        fileSize: { 
          maxSize: maxSizeInMB,
          actualSize: Math.round(file.size / 1024 / 1024 * 100) / 100
        } 
      };
    };
  }

  /**
   * Validate file type
   */
  static fileType(allowedTypes: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || !(control.value instanceof File)) return null;

      const file = control.value as File;
      return allowedTypes.includes(file.type) ? null : { 
        fileType: { 
          allowedTypes,
          actualType: file.type
        } 
      };
    };
  }
}