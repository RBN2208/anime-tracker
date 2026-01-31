import React, { useState } from 'react';
import { CalendarEvent } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CalendarDayProps {
  date: Date;
  events: CalendarEvent[];
  isToday: boolean;
  isCurrentMonth: boolean;
  onEventClick?: (event: CalendarEvent) => void;
}

// Generate consistent color for each anime based on ID
function getAnimeColor(animeId: string): string {
  const colors = [
    'bg-blue-500/20 border-blue-500/40 text-blue-700 dark:text-blue-300',
    'bg-purple-500/20 border-purple-500/40 text-purple-700 dark:text-purple-300',
    'bg-green-500/20 border-green-500/40 text-green-700 dark:text-green-300',
    'bg-orange-500/20 border-orange-500/40 text-orange-700 dark:text-orange-300',
    'bg-pink-500/20 border-pink-500/40 text-pink-700 dark:text-pink-300',
    'bg-cyan-500/20 border-cyan-500/40 text-cyan-700 dark:text-cyan-300',
    'bg-red-500/20 border-red-500/40 text-red-700 dark:text-red-300',
    'bg-yellow-500/20 border-yellow-500/40 text-yellow-700 dark:text-yellow-300',
  ];
  
  // Simple hash function to get consistent color
  let hash = 0;
  for (let i = 0; i < animeId.length; i++) {
    hash = animeId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export const CalendarDay = React.memo(function CalendarDay({
  date,
  events,
  isToday,
  isCurrentMonth,
  onEventClick
}: CalendarDayProps) {
  const dayNumber = date.getDate();
  const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        'min-h-20 md:min-h-24 border border-border p-1.5 md:p-2 transition-all duration-200 touch-manipulation',
        'hover:bg-accent/50 hover:shadow-sm active:bg-accent',
        !isCurrentMonth && 'bg-muted/30 text-muted-foreground opacity-60',
        isToday && 'bg-primary/10 border-primary ring-2 ring-primary/20',
        isPast && isCurrentMonth && 'opacity-75'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-1">
        <span
          className={cn(
            'text-sm font-medium transition-colors',
            isToday && 'text-primary font-bold',
            isPast && 'text-muted-foreground'
          )}
        >
          {dayNumber}
        </span>
        {isToday && (
          <Badge variant="default" className="text-xs h-5 animate-in fade-in duration-300">
            Heute
          </Badge>
        )}
      </div>

      <div className="space-y-1">
        {events.slice(0, 3).map((event, index) => (
          <div
            key={event.id}
            className={cn(
              'text-xs p-1.5 rounded border cursor-pointer transition-all duration-200',
              'hover:scale-105 hover:shadow-md',
              'animate-in fade-in slide-in-from-left-2',
              getAnimeColor(event.animeId),
              isPast && 'opacity-60'
            )}
            style={{ animationDelay: `${index * 50}ms` }}
            title={`${event.title || 'Anime'} - S${event.season}E${event.episodeNumber}`}
            onClick={() => onEventClick?.(event)}
          >
            <span className="font-semibold">
              S{event.season}E{event.episodeNumber}
            </span>
            {event.title && (
              <span className="ml-1.5 font-medium truncate block">
                {event.title}
              </span>
            )}
          </div>
        ))}

        {events.length > 3 && (
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs w-full justify-center transition-all duration-200",
              isHovered && "bg-accent"
            )}
          >
            +{events.length - 3} mehr
          </Badge>
        )}

        {events.length === 0 && isCurrentMonth && !isPast && (
          <p className="text-xs text-muted-foreground/50 text-center py-2">
            Keine Releases
          </p>
        )}
      </div>
    </div>
  );
});
