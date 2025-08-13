import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../tokens/api.token';
import { QROptions, QRItem, QRType } from '../models/qr';
import { BatchItem, BatchResponseItem } from '../models/batch';

@Injectable({ providedIn: 'root' })
export class QRService {
  private http = inject(HttpClient);
  private apiBase = inject(API_BASE_URL);

  generateStatic(type: QRType, data: any, options: QROptions): Observable<{ image: string | null; imageUrl?: string }> {
    return this.http.post<{ image: string | null; imageUrl?: string }>(
      `${this.apiBase}/qr/generate`, 
      { type, data, options }
    );
  }

  createDynamic(type: QRType, data: any, options: QROptions, title?: string): Observable<{ id: string; shortUrl: string; imageUrl?: string }> {
    return this.http.post<{ id: string; shortUrl: string; imageUrl?: string }>(
      `${this.apiBase}/qr/dynamic`, 
      { type, data, options, title }
    );
  }

  getMyQRCodes(): Observable<QRItem[]> {
    return this.http.get<QRItem[]>(`${this.apiBase}/user/qrcodes`);
  }

  getQR(id: string): Observable<QRItem> {
    return this.http.get<QRItem>(`${this.apiBase}/qr/${id}`);
  }

  updateQR(id: string, payload: Partial<{ data: any; options: QROptions; title: string }>): Observable<QRItem> {
    return this.http.patch<QRItem>(`${this.apiBase}/qr/${id}`, payload);
  }

  deleteQR(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBase}/qr/${id}`);
  }

  batch(items: BatchItem[], dynamic: boolean): Observable<BatchResponseItem[]> {
    return this.http.post<BatchResponseItem[]>(`${this.apiBase}/qr/batch`, { items, dynamic });
  }

  duplicateQR(id: string): Observable<QRItem> {
    return this.http.post<QRItem>(`${this.apiBase}/qr/${id}/duplicate`, {});
  }

  toggleStatus(id: string, active: boolean): Observable<QRItem> {
    return this.http.patch<QRItem>(`${this.apiBase}/qr/${id}/status`, { active });
  }
}