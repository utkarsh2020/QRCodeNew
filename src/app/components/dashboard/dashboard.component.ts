import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

import { QRService } from '../../core/services/qr.service';
import { AnalyticsService } from '../../core/services/analytics.service';
import { QRItem } from '../../core/models/qr';
import { AnalyticsSummary } from '../../core/models/analytics';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatMenuModule,
    BaseChartDirective
  ],
  templateUrl: './dashboard.component.html',
  styles: [`
    .dashboard-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      text-align: center;

      .stat-value {
        font-size: 2rem;
        font-weight: bold;
        color: #1976d2;
      }

      .stat-label {
        color: #666;
        font-size: 0.9rem;
      }
    }

    .qr-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }

    .qr-card {
      .qr-image {
        width: 100%;
        max-width: 200px;
        height: auto;
        margin: 0 auto 1rem;
        display: block;
        border-radius: 8px;
      }

      .qr-info {
        text-align: center;

        .qr-title {
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .qr-meta {
          font-size: 0.8rem;
          color: #666;
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
      }
    }

    .chart-container {
      margin: 2rem 0;
      height: 400px;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #666;

      mat-icon {
        font-size: 4rem;
        width: 4rem;
        height: 4rem;
        margin-bottom: 1rem;
        opacity: 0.5;
      }
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .qr-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private qrService = inject(QRService);
  private analyticsService = inject(AnalyticsService);

  qrCodes = signal<QRItem[]>([]);
  isLoading = signal(true);
  selectedQR = signal<QRItem | null>(null);
  analytics = signal<AnalyticsSummary | null>(null);

  // Chart configuration
  chartData: ChartData<'line'> = {
    labels: [],
    datasets: [{
      label: 'Scans',
      data: [],
      borderColor: '#1976d2',
      backgroundColor: 'rgba(25, 118, 210, 0.1)',
      fill: true
    }]
  };

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  chartType: ChartType = 'line';

  ngOnInit(): void {
    this.loadQRCodes();
  }

  async loadQRCodes(): Promise<void> {
    this.isLoading.set(true);

    try {
      const codes = await this.qrService.getMyQRCodes().toPromise();
      this.qrCodes.set(codes || []);
    } catch (error) {
      console.error('Failed to load QR codes:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async viewAnalytics(qrItem: QRItem): Promise<void> {
    this.selectedQR.set(qrItem);

    try {
      const analyticsData = await this.analyticsService.getSummary(qrItem.id).toPromise();
      if (analyticsData) {
        this.analytics.set(analyticsData);

        // Update chart data
        this.chartData = {
          labels: analyticsData.timeseries.map(t => new Date(t.date).toLocaleDateString()),
          datasets: [{
            label: 'Scans',
            data: analyticsData.timeseries.map(t => t.count),
            borderColor: '#1976d2',
            backgroundColor: 'rgba(25, 118, 210, 0.1)',
            fill: true
          }]
        };
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  }

  async deleteQR(qrItem: QRItem): Promise<void> {
    if (!confirm(`Are you sure you want to delete "${qrItem.title || qrItem.type.toUpperCase()}"?`)) {
      return;
    }

    try {
      await this.qrService.deleteQR(qrItem.id).toPromise();
      await this.loadQRCodes();

      // Clear analytics if this was the selected QR
      if (this.selectedQR()?.id === qrItem.id) {
        this.selectedQR.set(null);
        this.analytics.set(null);
      }
    } catch (error) {
      console.error('Failed to delete QR code:', error);
    }
  }

  async duplicateQR(qrItem: QRItem): Promise<void> {
    try {
      await this.qrService.duplicateQR(qrItem.id).toPromise();
      await this.loadQRCodes();
    } catch (error) {
      console.error('Failed to duplicate QR code:', error);
    }
  }

  getQRTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      url: 'link',
      text: 'text_fields',
      email: 'email',
      sms: 'sms',
      wifi: 'wifi',
      vcard: 'contact_page',
      social: 'share',
      payment: 'payment',
      file: 'attach_file'
    };
    return icons[type] || 'qr_code';
  }

  getTotalScans(): number {
    return this.qrCodes().reduce((total, qr) => total + (qr.scanCount || 0), 0);
  }

  getStatistics() {
    const codes = this.qrCodes();
    return {
      total: codes.length,
      dynamic: codes.filter(qr => qr.isDynamic).length,
      static: codes.filter(qr => !qr.isDynamic).length,
      scans: this.getTotalScans()
    };
  }
}