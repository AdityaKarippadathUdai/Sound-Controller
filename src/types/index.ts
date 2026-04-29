/**
 * Global App Types
 */

export enum PhoneMode {
  SILENT = "silent",
  VIBRATE = "vibrate",
  NORMAL = "normal",
}

export type Day =
  | "Mon"
  | "Tue"
  | "Wed"
  | "Thu"
  | "Fri"
  | "Sat"
  | "Sun";

export interface Schedule {
  id: string;
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  days: Day[];
  mode: PhoneMode;
  isEnabled: boolean;
  createdAt?: number;
}

export type Theme = "light" | "dark";

export interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  primaryDark: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  textOnPrimary: string;
  border: string;
  card: string;
  success: string;
  danger: string;
}
