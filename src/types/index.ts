/**
 * Global App Types
 */

export enum PhoneMode {
  SILENT = "Silent",
  VIBRATE = "Vibrate",
  NORMAL = "Normal",
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
}

export type Theme = "light" | "dark";

export interface ThemeColors {
  background: string;
  primary: string;
  secondary: string;
  surface: string;
  text: string;
  textDim: string;
}