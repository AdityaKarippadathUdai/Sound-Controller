/**
 * Convert "HH:mm" → minutes since midnight
 */
export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

/**
 * Convert minutes → "HH:mm"
 */
export const minutesToTime = (minutes: number): string => {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutes % 60)
    .toString()
    .padStart(2, "0");

  return `${h}:${m}`;
};

/**
 * Get current time in minutes
 */
export const getCurrentMinutes = (): number => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

/**
 * Get current day (Mon, Tue...)
 */
export const getCurrentDay = (): string => {
  return new Date().toLocaleDateString("en-US", {
    weekday: "short",
  });
};

/**
 * Check if time is within range (handles overnight)
 */
export const isTimeInRange = (
  startTime: string,
  endTime: string,
  currentTime?: string
): boolean => {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);

  const current = currentTime
    ? timeToMinutes(currentTime)
    : getCurrentMinutes();

  // Normal case
  if (start <= end) {
    return current >= start && current <= end;
  }

  // Overnight case (e.g. 22:00 → 07:00)
  return current >= start || current <= end;
};

/**
 * Check if today is included
 */
export const isTodayIncluded = (days: string[]): boolean => {
  const today = getCurrentDay();
  return days.includes(today);
};