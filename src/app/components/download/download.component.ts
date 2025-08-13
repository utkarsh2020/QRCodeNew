import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-download',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="dataUrl" class="download-preview">
      <img [src]="dataUrl" [alt]="'QR Code'" class="max-w-full h-auto" />
    </div>
  `,
  styles: [`
    .download-preview {
      display: flex;
      justify-content: center;
      padding: 1rem;
      background: #fafafa;
      border-radius: 8px;
      border: 2px dashed #e0e0e0;
    }
  `]
})
export class DownloadComponent {
  @Input() dataUrl: string | null = null;
}