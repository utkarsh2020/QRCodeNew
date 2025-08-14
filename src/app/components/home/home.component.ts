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
      position: relative;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 6rem 0;
      overflow: hidden;
    }

    .hero-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
      opacity: 0.3;
    }

    .hero-badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 50px;
      padding: 0.5rem 1.5rem;
      margin-bottom: 2rem;
      
      .badge-text {
        font-size: 0.875rem;
        font-weight: 500;
      }
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 1.5rem;
      
      @media (max-width: 768px) {
        font-size: 2.5rem;
      }
    }

    .hero-subtitle {
      font-size: 1.25rem;
      line-height: 1.6;
      margin-bottom: 3rem;
      opacity: 0.9;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-bottom: 4rem;
      
      @media (max-width: 640px) {
        flex-direction: column;
        align-items: center;
      }
    }

    .cta-primary {
      padding: 1rem 2rem !important;
      font-size: 1.1rem !important;
      font-weight: 600 !important;
      border-radius: 50px !important;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important;
      transition: all 0.3s ease !important;
    }

    .cta-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3) !important;
    }

    .cta-secondary {
      padding: 1rem 2rem !important;
      font-size: 1.1rem !important;
      font-weight: 600 !important;
      border-radius: 50px !important;
      border: 2px solid rgba(255, 255, 255, 0.8) !important;
      color: white !important;
      transition: all 0.3s ease !important;
    }

    .cta-secondary:hover {
      background: rgba(255, 255, 255, 0.1) !important;
      border-color: white !important;
    }

    .cta-secondary-white {
      padding: 1rem 2rem !important;
      font-size: 1.1rem !important;
      font-weight: 600 !important;
      border-radius: 50px !important;
      border: 2px solid white !important;
      color: white !important;
      transition: all 0.3s ease !important;
    }

    .cta-secondary-white:hover {
      background: white !important;
      color: #667eea !important;
    }

    .feature-highlights {
      display: flex;
      justify-content: center;
      gap: 2rem;
      flex-wrap: wrap;
      
      .highlight-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        padding: 0.75rem 1.5rem;
        border-radius: 50px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        
        mat-icon {
          font-size: 1.2rem;
        }
        
        span {
          font-size: 0.9rem;
          font-weight: 500;
        }
      }
    }

    .stats-section {
      padding: 4rem 0;
      background: white;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .stat-card {
      display: flex;
      align-items: center;
      padding: 2rem;
      text-align: left;
      
      .stat-icon {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        width: 60px;
        height: 60px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 1.5rem;
        
        mat-icon {
          font-size: 1.5rem;
        }
      }
      
      .stat-content {
        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 0.25rem;
        }
        
        .stat-label {
          color: #718096;
          font-weight: 500;
        }
      }
    }

    .features-section {
      padding: 6rem 0;
      background: #f7fafc;
    }

    .section-header {
      text-align: center;
      margin-bottom: 4rem;
      
      .section-title {
        font-size: 2.5rem;
        font-weight: 700;
        color: #1a202c;
        margin-bottom: 1rem;
      }
      
      .section-subtitle {
        font-size: 1.125rem;
        color: #718096;
        max-width: 600px;
        margin: 0 auto;
      }
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
    }

    .feature-card {
      padding: 2rem;
      transition: all 0.3s ease;
      border: 1px solid #e2e8f0;
      
      &.featured {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        transform: scale(1.05);
        
        .feature-title {
          color: white;
        }
        
        .feature-description {
          color: rgba(255, 255, 255, 0.9);
        }
        
        .feature-tag {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }
      }
    }

    .feature-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .feature-icon {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5rem;
      
      &.featured-icon {
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
      }
      
      mat-icon {
        font-size: 1.5rem;
      }
    }

    .feature-content {
      .feature-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: #1a202c;
        margin-bottom: 0.75rem;
      }
      
      .feature-description {
        color: #718096;
        line-height: 1.6;
        margin-bottom: 1rem;
      }
      
      .feature-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        
        .feature-tag {
          background: #e2e8f0;
          color: #4a5568;
          padding: 0.25rem 0.75rem;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 500;
        }
      }
    }

    .how-it-works-section {
      padding: 6rem 0;
      background: white;
    }

    .steps-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 3rem;
    }

    .step-item {
      display: flex;
      align-items: flex-start;
      gap: 1.5rem;
      
      .step-number {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 1.125rem;
        flex-shrink: 0;
      }
      
      .step-content {
        flex: 1;
        
        .step-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 0.5rem;
        }
        
        .step-description {
          color: #718096;
          line-height: 1.6;
        }
      }
      
      .step-icon {
        color: #667eea;
        
        mat-icon {
          font-size: 2rem;
          width: 2rem;
          height: 2rem;
        }
      }
    }

    .cta-section {
      padding: 6rem 0;
      
      .cta-content {
        max-width: 600px;
        margin: 0 auto;
        
        .cta-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 1rem;
        }
        
        .cta-subtitle {
          font-size: 1.125rem;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 3rem;
          line-height: 1.6;
        }
        
        .cta-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          
          @media (max-width: 640px) {
            flex-direction: column;
            align-items: center;
          }
        }
      }
    }

    @media (max-width: 768px) {
      .hero-section {
        padding: 4rem 0;
      }
      
      .stats-section,
      .features-section,
      .how-it-works-section,
      .cta-section {
        padding: 3rem 0;
      }
      
      .features-grid {
        grid-template-columns: 1fr;
      }
      
      .steps-container {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
    }
  `]
})
export class HomeComponent {
  features = [
    {
      icon: 'qr_code',
      title: 'Multiple QR Types',
      description: 'Generate QR codes for URLs, text, email, SMS, Wi-Fi, vCard, social media, and payments.',
      tags: ['URL', 'Text', 'Email', 'SMS', 'Wi-Fi', 'vCard']
    },
    {
      icon: 'palette',
      title: 'Advanced Customization',
      description: 'Customize colors, gradients, eye shapes, dot styles, logos, and more.',
      tags: ['Colors', 'Gradients', 'Logos', 'Shapes']
    },
    {
      icon: 'dynamic_form',
      title: 'Dynamic QR Codes',
      description: 'Create editable QR codes that can be updated without changing the image.',
      tags: ['Editable', 'Analytics', 'Tracking']
    },
    {
      icon: 'analytics',
      title: 'Detailed Analytics',
      description: 'Track scans, view charts, and analyze user engagement with comprehensive insights.',
      tags: ['Charts', 'Insights', 'Reports']
    },
    {
      icon: 'upload_file',
      title: 'Batch Processing',
      description: 'Upload CSV files to generate multiple QR codes at once.',
      tags: ['CSV', 'Bulk', 'Automation']
    },
    {
      icon: 'cloud_upload',
      title: 'Cloud Storage',
      description: 'Integrated Azure Blob Storage for logos and file uploads.',
      tags: ['Azure', 'Storage', 'CDN']
    }
  ];

  stats = [
    { label: 'QR Types', value: '10+', icon: 'category' },
    { label: 'Customization Options', value: '20+', icon: 'tune' },
    { label: 'File Formats', value: '3', icon: 'file_download' },
    { label: 'Cloud Integration', value: '100%', icon: 'cloud_done' }
  ];

  steps = [
    {
      title: 'Choose QR Type',
      description: 'Select from URL, text, email, SMS, Wi-Fi, vCard, and more',
      icon: 'category'
    },
    {
      title: 'Customize Design',
      description: 'Apply colors, logos, shapes, and advanced styling options',
      icon: 'palette'
    },
    {
      title: 'Generate & Track',
      description: 'Download your QR code and monitor performance with analytics',
      icon: 'analytics'
    }
  ];
}