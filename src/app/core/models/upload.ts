export interface SignedUploadRequest {
  filename: string;
  contentType: string;
  size?: number;
}

export interface SignedUploadResponse {
  uploadUrl: string; // SAS URL or signed PUT URL
  fileUrl: string;   // Public URL after upload
  expiresAt?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}