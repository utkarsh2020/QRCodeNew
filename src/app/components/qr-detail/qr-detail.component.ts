import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { QRCodeComponent } from 'angularx-qrcode';

import { QRService } from '../../core/services/qr.service';
import { StyleEditorComponent } from '../style-editor/style-editor.component';
import { QRItem, QROptions } from '../../core/models/qr';

@Component({
  selector: 'app-qr-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    QRCodeComponent,
    StyleEditorComponent
  ],
  templateUrl: './qr-detail.component.html',
  styles: [`
    .detail-container {
      padding: 2rem;
      max-width: 1000px;
      margin: 0 auto;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 2rem;

      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    }

    .preview-section {
      .qr-preview {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem;
        background: #fafafa;
        border-radius: 8px;
        text-align: center;

        qrcode {
          margin-bottom: 1rem;
        }

        .frame-text {
          font-weight: 500;
          color: #333;
        }
      }
    }

    .json-editor {
      font-family: 'Courier New', monospace;
      white-space: pre-wrap;
      line-height: 1.4;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    @media (max-width: 768px) {
      .detail-container {
        padding: 1rem;
      }

      .form-actions {
        flex-direction: column;

        button {
          width: 100%;
        }
      }
    }
  `]
})
export class QRDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private qrService = inject(QRService);
  private fb = inject(FormBuilder);

  qrItem = signal<QRItem | null>(null);
  isLoading = signal(true);
  isSaving = signal(false);

  editForm = this.fb.group({
    title: [''],
    data: [''],
    options: this.fb.control<QROptions>({})
  });

  options = signal<QROptions>({});

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadQR(id);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  async loadQR(id: string): Promise<void> {
    this.isLoading.set(true);

    try {
      const qr = await this.qrService.getQR(id).toPromise();
      if (qr) {
        this.qrItem.set(qr);
        this.options.set(qr.options || {});

        this.editForm.patchValue({
          title: qr.title || '',
          data: JSON.stringify(qr.data, null, 2),
          options: qr.options || {}
        });
      }
    } catch (error) {
      console.error('Failed to load QR code:', error);
      this.router.navigate(['/dashboard']);
    } finally {
      this.isLoading.set(false);
    }
  }

  async save(): Promise<void> {
    const qr = this.qrItem();
    if (!qr) return;

    this.isSaving.set(true);

    try {
      let parsedData;
      try {
        parsedData = JSON.parse(this.editForm.value.data || '{}');
      } catch (e) {
        alert('Invalid JSON in data field');
        return;
      }

      const payload = {
        title: this.editForm.value.title || undefined,
        data: parsedData,
        options: this.options() as any
      };

      const updated = await this.qrService.updateQR(qr.id, payload).toPromise();
      if (updated) {
        this.qrItem.set(updated);
        alert('QR code updated successfully');
      }
    } catch (error) {
      console.error('Failed to update QR code:', error);
      alert('Failed to update QR code. Please try again.');
    } finally {
      this.isSaving.set(false);
    }
  }

  async delete(): Promise<void> {
    const qr = this.qrItem();
    if (!qr) return;

    if (!confirm(`Are you sure you want to delete "${qr.title || qr.type.toUpperCase()}"?`)) {
      return;
    }

    try {
      await this.qrService.deleteQR(qr.id).toPromise();
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Failed to delete QR code:', error);
      alert('Failed to delete QR code. Please try again.');
    }
  }

  getPreviewData(): string {
    try {
      const data = JSON.parse(this.editForm.value.data || '{}');
      // Simple preview - in real app, format based on QR type
      return JSON.stringify(data);
    } catch (e) {
      return 'Invalid JSON';
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}