import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../tokens/api.token';
import { SignedUploadRequest, SignedUploadResponse, UploadProgress } from '../models/upload';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private http = inject(HttpClient);
  private apiBase = inject(API_BASE_URL);

  /**
   * Get signed URL for Azure Blob Storage upload
   */
  getSignedUrl(filename: string, contentType: string, size?: number): Observable<SignedUploadResponse> {
    const payload: SignedUploadRequest = { filename, contentType, size };
    return this.http.post<SignedUploadResponse>(`${this.apiBase}/upload/sign`, payload);
  }

  /**
   * Upload file directly to Azure Blob Storage using signed URL
   */
  async putFile(uploadUrl: string, file: File, contentType: string, onProgress?: (progress: UploadProgress) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress: UploadProgress = {
              loaded: event.loaded,
              total: event.total,
              percentage: Math.round((event.loaded / event.total) * 100)
            };
            onProgress(progress);
          }
        });
      }

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed: Network error'));
      });

      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob');
      xhr.setRequestHeader('Content-Type', contentType);
      xhr.send(file);
    });
  }

  /**
   * Complete upload flow: get signed URL and upload file
   */
  async uploadFile(file: File, onProgress?: (progress: UploadProgress) => void): Promise<string> {
    // Get signed URL from backend
    const signResponse = await firstValueFrom(
      this.getSignedUrl(file.name, file.type, file.size)
    );

    // Upload file to Azure Blob Storage
    await this.putFile(signResponse.uploadUrl, file, file.type, onProgress);

    // Return the public URL
    return signResponse.fileUrl;
  }

  /**
   * Upload logo (convenience method)
   */
  async uploadLogo(file: File, onProgress?: (progress: UploadProgress) => void): Promise<string> {
    if (!this.isValidImageFile(file)) {
      throw new Error('Invalid file type. Only images are allowed for logos.');
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      throw new Error('File size too large. Maximum 5MB allowed.');
    }

    return this.uploadFile(file, onProgress);
  }

  /**
   * Check if file is a valid image
   */
  private isValidImageFile(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    return allowedTypes.includes(file.type);
  }

  /**
   * Generate thumbnail URL (if supported by storage backend)
   */
  getThumbnailUrl(originalUrl: string, width: number = 150, height: number = 150): string {
    // This would depend on your Azure setup - you might have Azure Functions or CDN
    // that can generate thumbnails on the fly
    return originalUrl; // Fallback to original
  }

  /**
   * Delete file from storage
   */
  deleteFile(fileUrl: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBase}/upload/delete`, {
      body: { fileUrl }
    });
  }
}