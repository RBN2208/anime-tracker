/**
 * Parse a date string or Date object into a Date
 * For date strings in YYYY-MM-DD format, creates a date in local timezone at midnight
 */
export function parseDate(dateInput: string | Date): Date {
  if (dateInput instanceof Date) {
    return dateInput;
  }

  // Check if it's a YYYY-MM-DD format
  const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (dateOnlyRegex.test(dateInput)) {
    // Parse as local date to avoid timezone issues
    const [year, month, day] = dateInput.split('-').map(Number);
    // Set time to noon to avoid any timezone edge cases
    return new Date(year, month - 1, day, 12, 0, 0, 0);
  }

  const parsed = new Date(dateInput);
  if (isNaN(parsed.getTime())) {
    throw new Error(`Invalid date: ${dateInput}`);
  }

  return parsed;
}

/**
 * Format a date to ISO string for storage
 */
export function formatDateForStorage(date: Date): string {
  return date.toISOString();
}

/**
 * Format a date for display (YYYY-MM-DD)
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format a date for display with time (YYYY-MM-DD HH:mm)
 */
export function formatDateTime(date: Date): string {
  const dateStr = formatDate(date);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${dateStr} ${hours}:${minutes}`;
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Subtract days from a date
 */
export function subtractDays(date: Date, days: number): Date {
  return addDays(date, -days);
}

/**
 * Check if a value is a valid date
 */
export function isValidDate(date: unknown): boolean {
  if (date instanceof Date) {
    return !isNaN(date.getTime());
  }

  if (typeof date === 'string') {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
  }

  return false;
}

/**
 * Get the start of day (00:00:00) for a given date
 */
export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Get the end of day (23:59:59.999) for a given date
 */
export function endOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * Check if two dates are on the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Get the difference in days between two dates
 */
export function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.floor(diffTime / oneDay);
}

/**
 * Generate a unique ID (simple UUID v4 implementation)
 */
export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Get the start of a month (first day at 00:00:00)
 */
export function getMonthStart(date: Date): Date {
  const result = new Date(date);
  result.setDate(1);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Get the end of a month (last day at 23:59:59.999)
 */
export function getMonthEnd(date: Date): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + 1);
  result.setDate(0);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * Check if a date is within a date range (inclusive)
 */
export function isWithinRange(date: Date, start: Date, end: Date): boolean {
  const timestamp = date.getTime();
  return timestamp >= start.getTime() && timestamp <= end.getTime();
}

/**
 * Get the week number for a date (ISO 8601)
 */
export function getWeekNumber(date: Date): number {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
}

/**
 * Add months to a date
 */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}
