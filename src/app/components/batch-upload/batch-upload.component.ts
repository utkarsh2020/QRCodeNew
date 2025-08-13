import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';

import { QRService } from '../../core/services/qr.service';
import { BatchItem, BatchResponseItem } from '../../core/models/batch';

@Component({
  selector: 'app-batch-upload',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatTableModule
  ],
  templateUrl: './batch-upload.component.html',
  styles: [`
    .batch-container {
      padding: 2rem;
      max-width: 1000px;
      margin: 0 auto;
    }

    .csv-textarea {
      font-family: 'Courier New', monospace;
      font-size: 0.9rem;
      line-height: 1.4;
    }

    .example-section {
      background: #f5f5f5;
      padding: 1rem;
      border-radius: 8px;
      margin: 1rem 0;

      h4 {
        margin-bottom: 0.5rem;
        color: #333;
      }

      pre {
        background: white;
        padding: 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        overflow-x: auto;
      }
    }

    .results-section {
      margin-top: 2rem;

      .result-summary {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
        margin-bottom: 1rem;

        .summary-card {
          text-align: center;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 8px;

          .value {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 0.25rem;
          }

          .label {
            font-size: 0.875rem;
            color: #666;
          }
        }
      }
    }

    .results-table {
      margin-top: 1rem;
    }

    .status-success {
      color: #4caf50;
    }

    .status-error {
      color: #f44336;
    }

    @media (max-width: 768px) {
      .batch-container {
        padding: 1rem;
      }

      .result-summary {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class BatchUploadComponent {
  private qrService = inject(QRService);

  csvText = signal('');
  isDynamic = signal(false);
  isProcessing = signal(false);
  results = signal<BatchResponseItem[] | null>(null);
  error = signal<string | null>(null);

  displayedColumns: string[] = ['index', 'status', 'type', 'id', 'errors'];

  // Example CSV data
  exampleCsv = `type,data,options,title
url,"https://example.com","{\"width\": 256, \"color\": \"#000000\"}","Example Website"
text,"Hello World!","{\"width\": 200, \"bgColor\": \"#ffffff\"}","Greeting"
email,"{\"to\": \"test@example.com\", \"subject\": \"Hello\"}","{\"width\": 256}","Contact Email"`;

  async processBatch(): Promise<void> {
    this.error.set(null);
    this.results.set(null);

    if (!this.csvText().trim()) {
      this.error.set('Please enter CSV data');
      return;
    }

    this.isProcessing.set(true);

    try {
      const items = this.parseCsv(this.csvText());
      if (items.length === 0) {
        throw new Error('No valid items found in CSV');
      }

      const response = await this.qrService.batch(items, this.isDynamic()).toPromise();
      this.results.set(response || []);
    } catch (error: any) {
      this.error.set(error?.message || 'Failed to process batch');
    } finally {
      this.isProcessing.set(false);
    }
  }

  private parseCsv(csvText: string): BatchItem[] {
    const lines = csvText.trim().split('\n').filter(Boolean);

    if (lines.length < 2) {
      throw new Error('CSV must have at least a header row and one data row');
    }

    const headers = this.splitCsvLine(lines[0]).map(h => h.trim().toLowerCase());
    const typeIndex = headers.indexOf('type');
    const dataIndex = headers.indexOf('data');
    const optionsIndex = headers.indexOf('options');
    const titleIndex = headers.indexOf('title');

    if (typeIndex === -1 || dataIndex === -1) {
      throw new Error('CSV must have "type" and "data" columns');
    }

    const items: BatchItem[] = [];

    for (let i = 1; i < lines.length; i++) {
      try {
        const cells = this.splitCsvLine(lines[i]);

        const type = cells[typeIndex]?.trim();
        if (!type) continue;

        const dataStr = cells[dataIndex]?.trim();
        let data;
        try {
          data = JSON.parse(dataStr || '""');
        } catch (e) {
          // If not valid JSON, treat as string
          data = dataStr;
        }

        const optionsStr = cells[optionsIndex]?.trim();
        let options = {};
        if (optionsStr) {
          try {
            options = JSON.parse(optionsStr);
          } catch (e) {
            console.warn(`Invalid options JSON at line ${i + 1}:`, e);
          }
        }

        const title = titleIndex >= 0 ? cells[titleIndex]?.trim() : undefined;

        items.push({
          type: type as any,
          data,
          options,
          title
        });
      } catch (e) {
        console.warn(`Error parsing line ${i + 1}:`, e);
      }
    }

    return items;
  }

  private splitCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current);
    return result.map(s => s.trim());
  }

  loadExample(): void {
    this.csvText.set(this.exampleCsv);
  }

  clearResults(): void {
    this.results.set(null);
    this.error.set(null);
  }

  getResultsSummary() {
    const results = this.results();
    if (!results) return null;

    return {
      total: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    };
  }

  downloadResults(): void {
    const results = this.results();
    if (!results) return;

    const csvContent = [
      'Index,Status,ID,Short URL,Errors',
      ...results.map((r, i) => 
        `${i + 1},${r.success ? 'Success' : 'Failed'},"${r.id || ''}","${r.shortUrl || ''}","${r.errors || ''}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `batch-results-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}