import { QRType, QROptions } from './qr';

export interface BatchItem {
  type: QRType;
  data: any;
  options: QROptions;
  title?: string;
}

export interface BatchResponseItem {
  id?: string;
  imageUrl?: string;
  shortUrl?: string;
  errors?: string;
  success: boolean;
}

export interface BatchUploadResult {
  totalProcessed: number;
  successful: number;
  failed: number;
  results: BatchResponseItem[];
}