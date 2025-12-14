export interface PrayerDay {
  dayLabel: string; // "1", "Sat", "1 Ramadan", etc.
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface ProcessingState {
  status: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  message?: string;
}

export enum ViewMode {
  DAILY = 'DAILY',
  MONTHLY = 'MONTHLY'
}