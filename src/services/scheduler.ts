import { Schedule, PhoneMode } from "../types";

/**
 * Convert "HH:mm" → minutes since midnight
 */
const timeToMinutes = (time: string): number => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

/**
 * Get current time in minutes
 */
const getCurrentMinutes = (): number => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

/**
 * Check if today is included in schedule
 */
const isTodayIncluded = (days: string[]): boolean => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
  }); // "Mon", "Tue"...

  return days.includes(today);
};

/**
 * Check if current time is within schedule
 */
const isTimeInRange = (
  start: number,
  end: number,
  current: number
): boolean => {
  // Normal case: 09:00 → 17:00
  if (start <= end) {
    return current >= start && current <= end;
  }

  // Overnight case: 22:00 → 07:00
  return current >= start || current <= end;
};

/**
 * Get active schedule (if any)
 */
export const getActiveSchedule = (
  schedules: Schedule[]
): Schedule | null => {
  const currentMinutes = getCurrentMinutes();

  for (const schedule of schedules) {
    if (!schedule.isEnabled) continue;

    if (!isTodayIncluded(schedule.days)) continue;

    const start = timeToMinutes(schedule.startTime);
    const end = timeToMinutes(schedule.endTime);

    if (isTimeInRange(start, end, currentMinutes)) {
      return schedule;
    }
  }

  return null;
};

/**
 * Get current mode based on schedules
 */
export const getCurrentMode = (
  schedules: Schedule[]
): PhoneMode | null => {
  const active = getActiveSchedule(schedules);
  return active ? active.mode : null;
};