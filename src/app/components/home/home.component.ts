import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './home.component.html',
  styles: [`
    .hero-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .feature-card {
      transition: transform 0.2s ease-in-out;
    }

    .feature-card:hover {
      transform: translateY(-4px);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
    }

    .feature-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    @media (max-width: 768px) {
      .hero-content {
        text-align: center;
        padding: 2rem 1rem;
      }
    }
  `]
})
export class HomeComponent {
  features = [
    {
      icon: 'qr_code',
      title: 'Multiple QR Types',
      description: 'Generate QR codes for URLs, text, email, SMS, Wi-Fi, vCard, social media, and payments.'
    },
    {
      icon: 'palette',
      title: 'Advanced Customization',
      description: 'Customize colors, gradients, eye shapes, dot styles, logos, and more.'
    },
    {
      icon: 'dynamic_form',
      title: 'Dynamic QR Codes',
      description: 'Create editable QR codes that can be updated without changing the image.'
    },
    {
      icon: 'analytics',
      title: 'Detailed Analytics',
      description: 'Track scans, view charts, and analyze user engagement with comprehensive insights.'
    },
    {
      icon: 'upload_file',
      title: 'Batch Processing',
      description: 'Upload CSV files to generate multiple QR codes at once.'
    },
    {
      icon: 'cloud_upload',
      title: 'Cloud Storage',
      description: 'Integrated Azure Blob Storage for logos and file uploads.'
    }
  ];

  stats = [
    { label: 'QR Types', value: '10+' },
    { label: 'Customization Options', value: '20+' },
    { label: 'File Formats', value: 'PNG, SVG, PDF' },
    { label: 'Cloud Integration', value: 'Azure Blob' }
  ];
}