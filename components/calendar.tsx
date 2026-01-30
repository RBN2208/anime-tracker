'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { CalendarEvent } from '@/types';
import { CalendarDay } from '@/components/calendar-day';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  getMonthDays,
  getWeekdayNames,
  isToday as checkIsToday,
  isSameDay,
  getMonthYearDisplay,
  isCurrentMonth as checkIsCurrentMonth,
  getPreviousMonth,
  getNextMonth
} from '@/lib/calendar-utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  events: CalendarEvent[];
  currentDate?: Date;
  onDateChange?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
}

export function Calendar({ events, currentDate, onDateChange, onEventClick }: CalendarProps) {
  const today = new Date();
  const [displayDate, setDisplayDate] = useState(currentDate || today);

  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();

  // Get all days for the calendar grid
  const calendarDays = useMemo(() => getMonthDays(year, month), [year, month]);

  // Get weekday names
  const weekdays = useMemo(() => getWeekdayNames(), []);

  // Group events by date
  const eventsByDate = useMemo(() => {
    const grouped = new Map<string, CalendarEvent[]>();

    events.forEach((event) => {
      // Use the date string directly if available (YYYY-MM-DD format)
      const dateKey = typeof event.date === 'string' ? event.date : event.date.toISOString().split('T')[0];

      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)!.push(event);
    });

    return grouped;
  }, [events]);

  // Get events for a specific date
  const getEventsForDate = useCallback(
    (date: Date): CalendarEvent[] => {
      // Format date as YYYY-MM-DD in local timezone
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;
      return eventsByDate.get(dateKey) || [];
    },
    [eventsByDate]
  );

  // Navigation handlers
  const handlePreviousMonth = useCallback(() => {
    const { year: newYear, month: newMonth } = getPreviousMonth(year, month);
    const newDate = new Date(newYear, newMonth, 1);
    setDisplayDate(newDate);
    onDateChange?.(newDate);
  }, [year, month, onDateChange]);

  const handleNextMonth = useCallback(() => {
    const { year: newYear, month: newMonth } = getNextMonth(year, month);
    const newDate = new Date(newYear, newMonth, 1);
    setDisplayDate(newDate);
    onDateChange?.(newDate);
  }, [year, month, onDateChange]);

  const handleToday = useCallback(() => {
    setDisplayDate(today);
    onDateChange?.(today);
  }, [today, onDateChange]);

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4 p-4 md:p-6">
        {/* Navigation Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePreviousMonth}
              aria-label="Vorheriger Monat"
              className="touch-manipulation"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl md:text-2xl font-bold min-w-[160px] md:min-w-[200px] text-center">
              {getMonthYearDisplay(year, month)}
            </h2>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextMonth}
              aria-label="Nächster Monat"
              className="touch-manipulation"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Button variant="outline" onClick={handleToday} className="touch-manipulation w-full sm:w-auto">
            Heute
          </Button>
        </div>

        <Separator />

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-0">
          {weekdays.map((day) => (
            <div
              key={day}
              className="text-center text-xs md:text-sm font-semibold text-muted-foreground py-2"
            >
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.slice(0, 2)}</span>
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-0 overflow-x-auto">
          {calendarDays.map((date, index) => (
            <CalendarDay
              key={index}
              date={date}
              events={getEventsForDate(date)}
              isToday={checkIsToday(date)}
              isCurrentMonth={checkIsCurrentMonth(date, year, month)}
              onEventClick={onEventClick}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
