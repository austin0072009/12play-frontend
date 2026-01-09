/**
 * Myanmar Time Utility
 * Myanmar Standard Time (MMT) is UTC+6:30
 */

const MYANMAR_TIMEZONE = "Asia/Yangon";

/**
 * Get the current date/time in Myanmar timezone
 */
export function getMyanmarNow(): Date {
  // Create a date string in Myanmar timezone, then parse it back
  const now = new Date();
  const myanmarString = now.toLocaleString("en-US", {
    timeZone: MYANMAR_TIMEZONE,
  });
  return new Date(myanmarString);
}

/**
 * Get current timestamp in Myanmar timezone (milliseconds)
 */
export function getMyanmarTimestamp(): number {
  return getMyanmarNow().getTime();
}

/**
 * Get today's date in Myanmar timezone as YYYY-MM-DD string
 */
export function getMyanmarDateString(): string {
  const mmtNow = getMyanmarNow();
  const year = mmtNow.getFullYear();
  const month = String(mmtNow.getMonth() + 1).padStart(2, "0");
  const day = String(mmtNow.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Get current day of week in Myanmar timezone
 * Returns 1-7 where 1=Monday, 7=Sunday (API format)
 */
export function getMyanmarDayOfWeek(): number {
  const mmtNow = getMyanmarNow();
  const dayOfWeek = mmtNow.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  // Convert to API format: 1=Monday, 7=Sunday
  return dayOfWeek === 0 ? 7 : dayOfWeek;
}

/**
 * Parse a date/time string and convert it to a timestamp for comparison
 * The input time is already in Myanmar timezone from the server
 */
export function parseServerTime(timeStr: string): number {
  if (!timeStr) return 0;
  // Server times are already in Myanmar timezone, parse directly
  const cleaned = timeStr.replace(".0", "");
  return new Date(cleaned).getTime();
}

/**
 * Calculate time difference between a target time and current Myanmar time
 * Returns milliseconds (positive if target is in future)
 */
export function getTimeDiffFromMyanmarNow(targetTimeStr: string): number {
  const targetTime = parseServerTime(targetTimeStr);
  const myanmarNow = getMyanmarTimestamp();
  return targetTime - myanmarNow;
}

/**
 * Get tomorrow's date in Myanmar timezone as YYYY-MM-DD string
 */
export function getMyanmarTomorrowDateString(): string {
  const mmtNow = getMyanmarNow();
  mmtNow.setDate(mmtNow.getDate() + 1);
  const year = mmtNow.getFullYear();
  const month = String(mmtNow.getMonth() + 1).padStart(2, "0");
  const day = String(mmtNow.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Check if current Myanmar time is after a specific hour:minute
 */
export function isMyanmarTimeAfter(hour: number, minute: number = 0): boolean {
  const mmtNow = getMyanmarNow();
  const currentHour = mmtNow.getHours();
  const currentMinute = mmtNow.getMinutes();
  return currentHour > hour || (currentHour === hour && currentMinute >= minute);
}
