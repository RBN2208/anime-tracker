import { Anime, CalendarEvent } from '@/types';
import { parseDate, addDays, addMonths, isWithinRange, formatDate } from '@/lib/date-utils';

export interface GenerateEventsOptions {
  anime: Anime;
  startDate: Date;
  endDate: Date;
  maxEpisodes?: number;
}

/**
 * Generate calendar events for an anime based on its release schedule
 * @param options - Configuration for event generation
 * @returns Array of calendar events
 */
export function generateEvents(options: GenerateEventsOptions): CalendarEvent[] {
  const { anime, startDate, endDate, maxEpisodes } = options;
  const events: CalendarEvent[] = [];

  try {
    // Parse the anime's start date
    const animeStartDate = parseDate(anime.startDate);

    // Start from anime's start date
    let currentDate = animeStartDate;
    let episodeNumber = anime.episodeStart;
    let eventCount = 0;

    // If anime started before the requested start date, we need to calculate
    // which episode we would be at by the start date
    if (animeStartDate < startDate) {
      const daysPassed = Math.floor((startDate.getTime() - animeStartDate.getTime()) / (1000 * 60 * 60 * 24));
      const episodesPassed = Math.floor(daysPassed / anime.releaseInterval);
      
      // Move current date to the first release within the date range
      currentDate = addDays(animeStartDate, episodesPassed * anime.releaseInterval);
      episodeNumber = anime.episodeStart + episodesPassed;
      
      // If this date is still before startDate, move to next episode
      if (currentDate < startDate) {
        currentDate = addDays(currentDate, anime.releaseInterval);
        episodeNumber++;
      }
    }

    // Generate events until we reach the end date or max episodes
    while (currentDate <= endDate) {
      // Check if we've reached the max episodes limit from options
      if (maxEpisodes && eventCount >= maxEpisodes) {
        break;
      }

      // Check if we've reached the max episodes for this anime
      if (anime.maxEpisodes && episodeNumber > anime.maxEpisodes) {
        break;
      }

      const event: CalendarEvent = {
        id: `${anime.id}-ep${episodeNumber}-${formatDate(currentDate)}`,
        animeId: anime.id,
        date: formatDate(currentDate),
        episodeNumber,
        season: anime.season,
        title: anime.title,
        sourceUrl: anime.sourceUrl,
      };

      events.push(event);
      eventCount++;
      episodeNumber++;

      // Move to next release date
      currentDate = addDays(currentDate, anime.releaseInterval);
    }
  } catch (error) {
    console.error('Error generating events for anime:', anime.id, error);
  }

  return events;
}

/**
 * Generate events for all animes within a date range
 * @param animes - Array of anime to generate events for
 * @param startDate - Start of date range (optional, defaults to earliest anime start date or 6 months ago)
 * @param endDate - End of date range (optional, defaults to +3 months)
 * @returns Aggregated and sorted array of calendar events
 */
export function getAllEvents(
  animes: Anime[],
  startDate?: Date,
  endDate?: Date
): CalendarEvent[] {
  const now = new Date();
  
  // If no start date provided, use the earliest anime start date or 6 months ago, whichever is more recent
  let start = startDate;
  if (!start && animes.length > 0) {
    const earliestAnimeDate = animes.reduce((earliest, anime) => {
      const animeDate = parseDate(anime.startDate);
      return animeDate < earliest ? animeDate : earliest;
    }, now);
    
    // Start from earliest anime date, but at least show last 6 months
    const sixMonthsAgo = addMonths(now, -6);
    start = earliestAnimeDate < sixMonthsAgo ? sixMonthsAgo : earliestAnimeDate;
  } else if (!start) {
    start = now;
  }
  
  const end = endDate || addMonths(now, 3);

  // Generate events for all animes
  const allEvents = animes.flatMap((anime) =>
    generateEvents({
      anime,
      startDate: start,
      endDate: end,
    })
  );

  // Sort events by date, then by title
  return allEvents.sort((a, b) => {
    const dateA = typeof a.date === 'string' ? a.date : formatDate(a.date);
    const dateB = typeof b.date === 'string' ? b.date : formatDate(b.date);
    const dateCompare = dateA.localeCompare(dateB);
    if (dateCompare !== 0) {
      return dateCompare;
    }

    // If dates are equal, sort by title (or anime ID if no title)
    const titleA = a.title || a.animeId;
    const titleB = b.title || b.animeId;
    return titleA.localeCompare(titleB);
  });
}

/**
 * Map events to calendar format (grouped by date)
 * @param events - Array of calendar events
 * @param month - Month number (1-12)
 * @param year - Year
 * @returns Map of date strings to event arrays
 */
export function mapEventsToCalendar(
  events: CalendarEvent[],
  month: number,
  year: number
): Map<string, CalendarEvent[]> {
  const eventMap = new Map<string, CalendarEvent[]>();

  // Filter events for the specified month and year
  const filteredEvents = events.filter((event) => {
    const eventDate = parseDate(event.date);
    return (
      eventDate.getMonth() === month - 1 && // JavaScript months are 0-indexed
      eventDate.getFullYear() === year
    );
  });

  // Group events by date
  for (const event of filteredEvents) {
    const dateKey = typeof event.date === 'string' ? event.date : formatDate(event.date);
    const existing = eventMap.get(dateKey) || [];
    existing.push(event);
    eventMap.set(dateKey, existing);
  }

  return eventMap;
}

/**
 * Get events for a specific date range
 * @param events - Array of calendar events
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Filtered array of events within the date range
 */
export function getEventsInRange(
  events: CalendarEvent[],
  startDate: Date,
  endDate: Date
): CalendarEvent[] {
  return events.filter((event) => {
    const eventDate = parseDate(event.date);
    return isWithinRange(eventDate, startDate, endDate);
  });
}
