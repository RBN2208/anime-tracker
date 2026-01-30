import { isSameDay as checkSameDay, startOfDay } from './date-utils';

/**
 * Get all days to display in a month calendar view
 * Includes padding days from previous and next month
 */
export function getMonthDays(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Get the weekday of the first day (0 = Sunday, 1 = Monday, etc.)
  // Adjust so Monday = 0
  let startWeekday = firstDay.getDay() - 1;
  if (startWeekday < 0) startWeekday = 6;

  // Calculate days from previous month to show
  const days: Date[] = [];

  // Add days from previous month
  for (let i = startWeekday - 1; i >= 0; i--) {
    const day = new Date(year, month, -i);
    days.push(day);
  }

  // Add days from current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }

  // Add days from next month to complete the grid (42 days total = 6 weeks)
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push(new Date(year, month + 1, i));
  }

  return days;
}

/**
 * Get weekday names starting with Monday
 */
export function getWeekdayNames(locale: string = 'de-DE'): string[] {
  const baseDate = new Date(2024, 0, 1); // A Monday
  const weekdays: string[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + i);
    weekdays.push(
      date.toLocaleDateString(locale, { weekday: 'short' })
    );
  }

  return weekdays;
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return checkSameDay(date, today);
}

/**
 * Re-export isSameDay from date-utils
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return checkSameDay(date1, date2);
}

/**
 * Get month name
 */
export function getMonthName(month: number, locale: string = 'de-DE'): string {
  const date = new Date(2024, month, 1);
  return date.toLocaleDateString(locale, { month: 'long' });
}

/**
 * Get full month and year display string
 */
export function getMonthYearDisplay(year: number, month: number, locale: string = 'de-DE'): string {
  const monthName = getMonthName(month, locale);
  return `${monthName} ${year}`;
}

/**
 * Check if a date belongs to the current display month
 */
export function isCurrentMonth(date: Date, year: number, month: number): boolean {
  return date.getFullYear() === year && date.getMonth() === month;
}

/**
 * Navigate to previous month
 */
export function getPreviousMonth(year: number, month: number): { year: number; month: number } {
  if (month === 0) {
    return { year: year - 1, month: 11 };
  }
  return { year, month: month - 1 };
}

/**
 * Navigate to next month
 */
export function getNextMonth(year: number, month: number): { year: number; month: number } {
  if (month === 11) {
    return { year: year + 1, month: 0 };
  }
  return { year, month: month + 1 };
}
