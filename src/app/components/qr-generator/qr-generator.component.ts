import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { QRCodeComponent } from 'angularx-qrcode';

import { QRService } from '../../core/services/qr.service';
import { StorageService } from '../../core/services/storage.service';
import { StyleEditorComponent } from '../style-editor/style-editor.component';
import { ErrorMessagesComponent } from '../../shared/form/error-messages.component';
import { FormValidators } from '../../core/validators/form.validators';
import { 
  QROptions, 
  QRType, 
  EmailData, 
  SMSData, 
  WiFiData, 
  VCardData, 
  SocialData, 
  PaymentData, 
  FileRedirectData 
} from '../../core/models/qr';

@Component({
  selector: 'app-qr-generator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    QRCodeComponent,
    StyleEditorComponent,
    ErrorMessagesComponent
  ],
  templateUrl: './qr-generator.component.html',
  styleUrls: ['./qr-generator.component.scss']
})
export class QRGeneratorComponent {
  private fb = inject(FormBuilder);
  private qrService = inject(QRService);
  private storageService = inject(StorageService);

  // Form and state
  selectedType = signal<QRType>('url');
  isDynamic = signal(false);
  isGenerating = signal(false);
  isUploadingLogo = signal(false);

  // Results
  generatedImageDataUrl = signal<string | null>(null);
  generatedShortUrl = signal<string | null>(null);

  // Options
  options = signal<QROptions>({
    color: '#000000',
    bgColor: '#ffffff',
    width: 256,
    errorCorrection: 'M',
    dotStyle: 'square',
    eyeShape: 'square',
    quietZone: 0,
    roundedCorners: 0
  });

  // Forms for different QR types
  urlForm = this.fb.group({
    url: ['', [Validators.required, FormValidators.url()]]
  });

  textForm = this.fb.group({
    text: ['', Validators.required]
  });

  emailForm = this.fb.group({
    to: ['', [Validators.required, FormValidators.email()]],
    subject: [''],
    body: ['']
  });

  smsForm = this.fb.group({
    phone: ['', [Validators.required, FormValidators.phone()]],
    message: ['']
  });

  wifiForm = this.fb.group({
    ssid: ['', [Validators.required, FormValidators.wifiSsid()]],
    password: ['', Validators.required],
    encryption: ['WPA'],
    hidden: [false]
  });

  vcardForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    org: [''],
    title: [''],
    phone: ['', FormValidators.phone()],
    email: ['', FormValidators.email()],
    url: ['', FormValidators.url()],
    address: ['']
  });

  socialForm = this.fb.group({
    facebook: ['', FormValidators.url()],
    instagram: ['', FormValidators.url()],
    twitter: ['', FormValidators.url()],
    linkedin: ['', FormValidators.url()],
    youtube: ['', FormValidators.url()],
    tiktok: ['', FormValidators.url()],
    website: ['', FormValidators.url()],
    whatsapp: ['']
  });

  paymentForm = this.fb.group({
    method: ['upi', Validators.required],
    // UPI fields
    upiId: [''],
    // PayPal fields  
    paypalMe: [''],
    currency: ['USD'],
    amount: ['', [Validators.min(0)]],
    note: ['']
  });

  fileForm = this.fb.group({
    fileUrl: ['', Validators.required],
    filename: [''],
    mimeType: ['']
  });

  generalForm = this.fb.group({
    title: [''],
    isDynamic: [false]
  });

  // Current active form
  currentForm = computed(() => {
    switch (this.selectedType()) {
      case 'url': return this.urlForm;
      case 'text': return this.textForm;
      case 'email': return this.emailForm;
      case 'sms': return this.smsForm;
      case 'wifi': return this.wifiForm;
      case 'vcard': return this.vcardForm;
      case 'social': return this.socialForm;
      case 'payment': return this.paymentForm;
      case 'file': return this.fileForm;
      default: return this.urlForm;
    }
  });

  // Preview data for QR code
  previewData = computed(() => {
    const type = this.selectedType();
    const form = this.currentForm();

    if (!form.valid) return 'Preview not available';

    const data = form.value;

    switch (type) {
      case 'url':
        return (data as any).url || '';

      case 'text':
        return (data as any).text || '';

      case 'email':
        const emailData = data as EmailData;
        const subject = emailData.subject ? `?subject=${encodeURIComponent(emailData.subject)}` : '';
        const body = emailData.body ? `${subject ? '&' : '?'}body=${encodeURIComponent(emailData.body)}` : '';
        return `mailto:${emailData.to}${subject}${body}`;

      case 'sms':
        const smsData = data as SMSData;
        return `SMSTO:${smsData.phone}:${smsData.message || ''}`;

      case 'wifi':
        const wifiData = data as WiFiData;
        return `WIFI:T:${wifiData.encryption};S:${wifiData.ssid};P:${wifiData.password};H:${wifiData.hidden ? 'true' : 'false'};;`;

      case 'vcard':
        return this.buildVCard(data as VCardData);

      case 'social':
      case 'payment':
        return JSON.stringify(data);

      case 'file':
        const fileData = data as FileRedirectData;
        return fileData.fileUrl || '';

      default:
        return JSON.stringify(data);
    }
  });

  onTypeChange(type: QRType): void {
    this.selectedType.set(type);
    this.clearResults();
  }

  async onLogoSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    this.isUploadingLogo.set(true);

    try {
      const logoUrl = await this.storageService.uploadLogo(file);
      this.options.update(opts => ({ ...opts, logoUrl }));
    } catch (error) {
      console.error('Logo upload failed:', error);
      // Handle error - show toast/snackbar
    } finally {
      this.isUploadingLogo.set(false);
    }
  }

  async onFileUpload(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    this.isUploadingLogo.set(true);

    try {
      const fileUrl = await this.storageService.uploadFile(file);
      this.fileForm.patchValue({
        fileUrl,
        filename: file.name,
        mimeType: file.type
      });
    } catch (error) {
      console.error('File upload failed:', error);
    } finally {
      this.isUploadingLogo.set(false);
    }
  }

  async generate(): Promise<void> {
    if (!this.currentForm().valid) {
      this.currentForm().markAllAsTouched();
      return;
    }

    this.isGenerating.set(true);
    this.clearResults();

    try {
      const type = this.selectedType();
      const data = this.formatDataForBackend(type, this.currentForm().value);
      const options = this.options();
      const title = this.generalForm.value.title || undefined;
      const dynamic = this.isDynamic();

      if (dynamic) {
        const response = await this.qrService.createDynamic(type, data, options, title).toPromise();
        if (response) {
          this.generatedImageDataUrl.set(response.imageUrl || null);
          this.generatedShortUrl.set(response.shortUrl);
        }
      } else {
        const response = await this.qrService.generateStatic(type, data, options).toPromise();
        if (response) {
          const imageUrl = response.image?.startsWith('data:') 
            ? response.image 
            : response.imageUrl;
          this.generatedImageDataUrl.set(imageUrl || null);
        }
      }
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      this.isGenerating.set(false);
    }
  }

  download(format: 'png' | 'svg' | 'pdf' = 'png'): void {
    const canvas = document.querySelector('qr-code canvas') as HTMLCanvasElement;
    if (!canvas) return;

    if (format === 'png') {
      const dataUrl = canvas.toDataURL('image/png');
      this.saveDataUrl(dataUrl, `qr-${Date.now()}.png`);
    } else if (format === 'pdf') {
      import('jspdf').then(({ jsPDF }) => {
        const pdf = new jsPDF();
        const dataUrl = canvas.toDataURL('image/png');
        const imgWidth = 150;
        const imgHeight = 150;
        pdf.addImage(dataUrl, 'PNG', 30, 30, imgWidth, imgHeight);
        if (this.options().frameText) {
          pdf.text(this.options().frameText!, 30, 200);
        }
        pdf.save(`qr-${Date.now()}.pdf`);
      });
    }
  }

  private buildVCard(data: VCardData): string {
    return [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:${data.lastName};${data.firstName}`,
      `FN:${data.firstName} ${data.lastName}`.trim(),
      data.org ? `ORG:${data.org}` : '',
      data.title ? `TITLE:${data.title}` : '',
      data.phone ? `TEL;TYPE=CELL:${data.phone}` : '',
      data.email ? `EMAIL:${data.email}` : '',
      data.url ? `URL:${data.url}` : '',
      data.address ? `ADR;TYPE=WORK:;;${data.address}` : '',
      'END:VCARD'
    ].filter(Boolean).join('\n');
  }

  private formatDataForBackend(type: QRType, formData: any): any {
    switch (type) {
      case 'vcard':
        return formData; // Backend will format vCard
      case 'payment':
        // Ensure payment method validation
        if (formData.method === 'upi') {
          return {
            method: 'upi',
            upiId: formData.upiId,
            amount: formData.amount,
            note: formData.note
          };
        } else {
          return {
            method: 'paypal',
            paypalMe: formData.paypalMe,
            currency: formData.currency,
            amount: formData.amount,
            note: formData.note
          };
        }
      default:
        return formData;
    }
  }

  private clearResults(): void {
    this.generatedImageDataUrl.set(null);
    this.generatedShortUrl.set(null);
  }

  private saveDataUrl(dataUrl: string, filename: string): void {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}