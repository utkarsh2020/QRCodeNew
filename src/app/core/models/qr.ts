export type QRType =
  | 'url' | 'text' | 'email' | 'sms' | 'wifi' | 'vcard'
  | 'social' | 'payment' | 'file';

export type EyeShape = 'square' | 'circle' | 'leaf' | 'diamond';
export type DotStyle = 'square' | 'rounded' | 'dots';

export interface GradientOptions {
  type?: 'linear' | 'radial';
  from?: string; // hex color
  to?: string;   // hex color
  rotation?: number; // degrees for linear gradient
}

export interface QROptions {
  color?: string;
  bgColor?: string;
  width?: number;
  errorCorrection?: 'L' | 'M' | 'Q' | 'H';
  dotStyle?: DotStyle;
  eyeShape?: EyeShape;
  frameText?: string;
  logoUrl?: string;
  gradient?: GradientOptions;
  quietZone?: number;       // pixels
  roundedCorners?: number;  // 0–1 ratio
}

export interface QRItem {
  id: string;
  type: QRType;
  data: any;
  isDynamic: boolean;
  imageUrl?: string;
  title?: string;
  createdAt: string;
  updatedAt?: string;
  options?: QROptions;
  shortUrl?: string;
  scanCount?: number;
}

// Specific data type interfaces
export interface EmailData {
  to: string;
  subject?: string;
  body?: string;
}

export interface SMSData {
  phone: string;
  message?: string;
}

export interface WiFiData {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

export interface VCardData {
  firstName: string;
  lastName: string;
  org?: string;
  title?: string;
  phone?: string;
  email?: string;
  url?: string;
  address?: string;
}

export interface SocialData {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
  website?: string;
  whatsapp?: string;
}

export interface PaymentData {
  method: 'upi' | 'paypal';
  // UPI fields
  upiId?: string;
  amount?: number;
  note?: string;
  // PayPal fields
  paypalMe?: string;
  currency?: string;
}

export interface FileRedirectData {
  fileUrl: string;
  filename?: string;
  mimeType?: string;
  size?: number;
}