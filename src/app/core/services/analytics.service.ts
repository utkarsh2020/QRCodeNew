import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../tokens/api.token';
import { AnalyticsSummary, ScanEvent } from '../models/analytics';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private http = inject(HttpClient);
  private apiBase = inject(API_BASE_URL);

  getSummary(qrId: string): Observable<AnalyticsSummary> {
    return this.http.get<AnalyticsSummary>(`${this.apiBase}/qr/analytics/${qrId}`);
  }

  getScanEvents(qrId: string, limit?: number, offset?: number): Observable<{ events: ScanEvent[]; total: number }> {
    const params: any = {};
    if (limit) params.limit = limit.toString();
    if (offset) params.offset = offset.toString();

    return this.http.get<{ events: ScanEvent[]; total: number }>(
      `${this.apiBase}/qr/analytics/${qrId}/events`,
      { params }
    );
  }

  getOverallStats(): Observable<{
    totalQRs: number;
    totalScans: number;
    todayScans: number;
    topQRs: { id: string; title: string; scanCount: number }[];
  }> {
    return this.http.get<{
      totalQRs: number;
      totalScans: number;
      todayScans: number;
      topQRs: { id: string; title: string; scanCount: number }[];
    }>(`${this.apiBase}/analytics/overview`);
  }

  exportAnalytics(qrId: string, format: 'csv' | 'json' = 'csv'): Observable<Blob> {
    return this.http.get(`${this.apiBase}/qr/analytics/${qrId}/export`, {
      params: { format },
      responseType: 'blob'
    });
  }
}