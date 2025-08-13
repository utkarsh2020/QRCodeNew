export interface AnalyticsSummary {
  totalScans: number;
  timeseries: { date: string; count: number }[];
  byDevice: Record<string, number>;
  byGeo: Record<string, number>;
  topReferrers?: Record<string, number>;
}

export interface ScanEvent {
  id: string;
  qrId: string;
  timestamp: string;
  userAgent?: string;
  ipAddress?: string;
  country?: string;
  city?: string;
  device?: string;
  browser?: string;
  referrer?: string;
}