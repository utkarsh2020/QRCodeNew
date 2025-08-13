import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { API_BASE_URL } from '../tokens/api.token';
import { QROptions, QRItem, QRType } from '../models/qr';
import { BatchItem, BatchResponseItem } from '../models/batch';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class QRService {
  private http = inject(HttpClient);
  private apiBase = inject(API_BASE_URL);
  private authService = inject(AuthService);
  
  private mockQRItems: QRItem[] = [
    {
      id: 'mock-qr-1',
      type: 'url',
      data: { url: 'https://example.com' },
      isDynamic: false,
      imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      title: 'Sample Website QR',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      options: { color: '#000000', bgColor: '#ffffff', width: 256 },
      scanCount: 12
    },
    {
      id: 'mock-qr-2',
      type: 'text',
      data: { text: 'Hello World! This is a test QR code.' },
      isDynamic: true,
      imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      title: 'Text Message QR',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      shortUrl: 'https://short.ly/abc123',
      options: { color: '#1976d2', bgColor: '#ffffff', width: 256 },
      scanCount: 34
    },
    {
      id: 'mock-qr-3',
      type: 'email',
      data: { to: 'contact@example.com', subject: 'Hello', body: 'Test message' },
      isDynamic: false,
      imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      title: 'Contact Email',
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      options: { color: '#4caf50', bgColor: '#ffffff', width: 256 },
      scanCount: 8
    },
    {
      id: 'mock-qr-4',
      type: 'vcard',
      data: { firstName: 'John', lastName: 'Doe', phone: '+1234567890', email: 'john@example.com' },
      isDynamic: true,
      imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      title: 'John Doe Contact',
      createdAt: new Date(Date.now() - 345600000).toISOString(),
      shortUrl: 'https://short.ly/def456',
      options: { color: '#ff9800', bgColor: '#ffffff', width: 256 },
      scanCount: 56
    }
  ];

  private isTestUser(): boolean {
    const token = this.authService.getToken();
    return !!token && token.startsWith('test-jwt-token-');
  }

  private generateMockImage(options: QROptions): string {
    const canvas = document.createElement('canvas');
    canvas.width = options.width || 256;
    canvas.height = options.width || 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = options.bgColor || '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = options.color || '#000000';
      ctx.fillRect(10, 10, canvas.width - 20, canvas.height - 20);
    }
    return canvas.toDataURL();
  }

  generateStatic(type: QRType, data: any, options: QROptions): Observable<{ image: string | null; imageUrl?: string }> {
    if (this.isTestUser()) {
      // Generate a simple QR code image for test users
      const canvas = document.createElement('canvas');
      canvas.width = options.width || 256;
      canvas.height = options.width || 256;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = options.bgColor || '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = options.color || '#000000';
        ctx.fillRect(10, 10, canvas.width - 20, canvas.height - 20);
      }
      const imageUrl = canvas.toDataURL();
      return of({ image: imageUrl, imageUrl });
    }
    
    return this.http.post<{ image: string | null; imageUrl?: string }>(
      `${this.apiBase}/qr/generate`, 
      { type, data, options }
    );
  }

  createDynamic(type: QRType, data: any, options: QROptions, title?: string): Observable<{ id: string; shortUrl: string; imageUrl?: string }> {
    if (this.isTestUser()) {
      const mockResponse = {
        id: 'mock-dynamic-' + Date.now(),
        shortUrl: 'https://short.ly/' + Math.random().toString(36).substring(7),
        imageUrl: this.generateMockImage(options)
      };
      return of(mockResponse);
    }
    
    return this.http.post<{ id: string; shortUrl: string; imageUrl?: string }>(
      `${this.apiBase}/qr/dynamic`, 
      { type, data, options, title }
    );
  }

  getMyQRCodes(): Observable<QRItem[]> {
    if (this.isTestUser()) {
      return of(this.mockQRItems);
    }
    
    return this.http.get<QRItem[]>(`${this.apiBase}/user/qrcodes`);
  }

  getQR(id: string): Observable<QRItem> {
    if (this.isTestUser()) {
      const mockItem = this.mockQRItems.find(item => item.id === id);
      if (mockItem) {
        return of(mockItem);
      }
      // Return a default mock item if not found
      return of({
        id,
        type: 'text',
        data: { text: 'Test QR Code Data' },
        isDynamic: true,
        imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        title: 'Test QR Code',
        createdAt: new Date().toISOString(),
        options: { color: '#000000', bgColor: '#ffffff', width: 256 },
        scanCount: 1
      });
    }
    
    return this.http.get<QRItem>(`${this.apiBase}/qr/${id}`);
  }

  updateQR(id: string, payload: Partial<{ data: any; options: QROptions; title: string }>): Observable<QRItem> {
    if (this.isTestUser()) {
      const existingItem = this.mockQRItems.find(item => item.id === id);
      const updatedItem: QRItem = {
        ...existingItem!,
        ...payload,
        updatedAt: new Date().toISOString()
      };
      
      // Update the mock items array
      const index = this.mockQRItems.findIndex(item => item.id === id);
      if (index !== -1) {
        this.mockQRItems[index] = updatedItem;
      }
      
      return of(updatedItem);
    }
    
    return this.http.patch<QRItem>(`${this.apiBase}/qr/${id}`, payload);
  }

  deleteQR(id: string): Observable<void> {
    if (this.isTestUser()) {
      const index = this.mockQRItems.findIndex(item => item.id === id);
      if (index !== -1) {
        this.mockQRItems.splice(index, 1);
      }
      return of(undefined);
    }
    
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