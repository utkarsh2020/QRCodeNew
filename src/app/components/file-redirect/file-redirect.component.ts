import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// Removed QRCodeComponent import since it's not used in the template

import { StorageService } from '../../core/services/storage.service';
import { QRService } from '../../core/services/qr.service';
import { QROptions, FileRedirectData } from '../../core/models/qr';

@Component({
  selector: 'app-file-redirect',
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
    // QRCodeComponent
  ],
  templateUrl: './file-redirect.component.html',
  styles: [`
    .file-redirect-container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .upload-section {
      .file-drop-zone {
        border: 2px dashed #ccc;
        border-radius: 8px;
        padding: 3rem;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;
        background: #fafafa;

        &:hover {
          border-color: #1976d2;
          background: #f0f8ff;
        }

        &.dragover {
          border-color: #1976d2;
          background: #e3f2fd;
        }

        mat-icon {
          font-size: 3rem;
          width: 3rem;
          height: 3rem;
          margin-bottom: 1rem;
          color: #666;
        }

        .upload-text {
          color: #666;
          margin-bottom: 0.5rem;
        }

        .upload-hint {
          font-size: 0.875rem;
          color: #999;
        }
      }

      .file-info {
        background: #e8f5e8;
        border: 1px solid #4caf50;
        border-radius: 8px;
        padding: 1rem;
        margin-top: 1rem;

        .file-details {
          display: flex;
          align-items: center;
          gap: 1rem;

          mat-icon {
            color: #4caf50;
          }

          .file-meta {
            flex: 1;

            .file-name {
              font-weight: 500;
              margin-bottom: 0.25rem;
            }

            .file-size {
              font-size: 0.875rem;
              color: #666;
            }
          }
        }
      }
    }

    .qr-section {
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

        .qr-info {
          color: #666;
          font-size: 0.875rem;
        }
      }
    }

    @media (max-width: 768px) {
      .file-redirect-container {
        padding: 1rem;
      }

      .upload-section .file-drop-zone {
        padding: 2rem 1rem;
      }
    }
  `]
})
export class FileRedirectComponent {
  private fb = inject(FormBuilder);
  private storageService = inject(StorageService);
  private qrService = inject(QRService);
  private router = inject(Router);

  isUploading = signal(false);
  isGenerating = signal(false);

  file = signal<File | null>(null);
  fileUrl = signal<string>('');
  generatedQR = signal<string | null>(null);

  fileForm = this.fb.group({
    title: ['', Validators.required],
    filename: [''],
    description: ['']
  });

  options: QROptions = {
    width: 256,
    color: '#000000',
    bgColor: '#ffffff',
    errorCorrection: 'M',
    dotStyle: 'square'
  };

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const selectedFile = input.files?.[0];

    if (selectedFile) {
      await this.handleFile(selectedFile);
    }
  }

  async onFileDrop(event: DragEvent): Promise<void> {
    event.preventDefault();
    event.stopPropagation();

    const droppedFile = event.dataTransfer?.files[0];
    if (droppedFile) {
      await this.handleFile(droppedFile);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  private async handleFile(selectedFile: File): Promise<void> {
    this.file.set(selectedFile);
    this.fileForm.patchValue({
      filename: selectedFile.name,
      title: selectedFile.name.split('.')[0] // Remove extension for title
    });

    await this.uploadFile();
  }

  private async uploadFile(): Promise<void> {
    const file = this.file();
    if (!file) return;

    this.isUploading.set(true);

    try {
      const uploadedUrl = await this.storageService.uploadFile(file, (progress) => {
        console.log(`Upload progress: ${progress.percentage}%`);
      });

      this.fileUrl.set(uploadedUrl);
    } catch (error) {
      console.error('File upload failed:', error);
      alert('File upload failed. Please try again.');
    } finally {
      this.isUploading.set(false);
    }
  }

  async generateQR(): Promise<void> {
    if (!this.fileForm.valid || !this.fileUrl()) {
      this.fileForm.markAllAsTouched();
      return;
    }

    this.isGenerating.set(true);

    try {
      const file = this.file();
      const fileData: FileRedirectData = {
        fileUrl: this.fileUrl(),
        filename: this.fileForm.value.filename || file?.name || 'Unknown File',
        mimeType: file?.type
      };

      const response = await this.qrService.createDynamic(
        'file',
        fileData,
        this.options,
        this.fileForm.value.title || undefined
      ).toPromise();

      if (response) {
        this.generatedQR.set(response.imageUrl || null);
        // Optionally redirect to dashboard after a delay
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 3000);
      }
    } catch (error) {
      console.error('QR generation failed:', error);
      alert('QR code generation failed. Please try again.');
    } finally {
      this.isGenerating.set(false);
    }
  }

  clearFile(): void {
    this.file.set(null);
    this.fileUrl.set('');
    this.generatedQR.set(null);
    this.fileForm.reset();
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getFileIcon(file: File): string {
    const type = file.type;
    if (type.startsWith('image/')) return 'image';
    if (type.startsWith('video/')) return 'video_library';
    if (type.startsWith('audio/')) return 'audio_file';
    if (type.includes('pdf')) return 'picture_as_pdf';
    if (type.includes('word') || type.includes('document')) return 'description';
    if (type.includes('sheet') || type.includes('excel')) return 'table_chart';
    if (type.includes('presentation') || type.includes('powerpoint')) return 'slideshow';
    return 'insert_drive_file';
  }
}