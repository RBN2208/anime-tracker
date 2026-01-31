import { Anime } from '@/types';
import { isValidDate } from '@/lib/date-utils';

const STORAGE_KEY = 'anime-tracker-data';
const SCHEMA_VERSION = '1.0.0';

interface StorageData {
  version: string;
  animes: Anime[];
  watchedEvents?: Record<string, boolean>;
  lastUpdated?: string;
}

/**
 * Initialize storage with default data structure
 */
export function initializeStorage(): void {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) {
      const initialData: StorageData = {
        version: SCHEMA_VERSION,
        animes: []
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    }
  } catch (error) {
    console.warn('Failed to initialize storage:', error);
  }
}

/**
 * Get all stored anime data
 */
export function getAnimes(): Anime[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      initializeStorage();
      return [];
    }

    const parsed: StorageData = JSON.parse(data);
    const animes = parsed.animes || [];
    
    // Validate data integrity
    return validateAnimeData(animes);
  } catch (error) {
    console.warn('Failed to load anime data:', error);
    return [];
  }
}

/**
 * Add a new anime to storage
 */
export function addAnime(anime: Anime): void {
  try {
    const animes = getAnimes();
    animes.push(anime);
    saveAnimes(animes);
  } catch (error) {
    console.error('Failed to add anime:', error);
    throw error;
  }
}

/**
 * Update an existing anime
 */
export function updateAnime(id: string, updates: Partial<Anime>): void {
  try {
    const animes = getAnimes();
    const index = animes.findIndex(anime => anime.id === id);

    if (index === -1) {
      throw new Error(`Anime with id ${id} not found`);
    }

    animes[index] = { ...animes[index], ...updates };
    saveAnimes(animes);
  } catch (error) {
    console.error('Failed to update anime:', error);
    throw error;
  }
}

/**
 * Delete an anime by ID
 */
export function deleteAnime(id: string): void {
  try {
    const animes = getAnimes();
    const filtered = animes.filter(anime => anime.id !== id);
    saveAnimes(filtered);
  } catch (error) {
    console.error('Failed to delete anime:', error);
    throw error;
  }
}

/**
 * Clear all storage data
 */
export function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    initializeStorage();
  } catch (error) {
    console.error('Failed to clear storage:', error);
    throw error;
  }
}

/**
 * Internal helper to save anime array to storage
 */
function saveAnimes(animes: Anime[]): void {
  const data: StorageData = {
    version: SCHEMA_VERSION,
    animes,
    lastUpdated: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * Validate anime data integrity
 */
export function validateAnimeData(animes: any[]): Anime[] {
  if (!Array.isArray(animes)) {
    return [];
  }

  return animes.filter((anime) => {
    try {
      return (
        anime &&
        typeof anime === 'object' &&
        typeof anime.id === 'string' &&
        anime.id.length > 0 &&
        typeof anime.sourceUrl === 'string' &&
        anime.sourceUrl.length > 0 &&
        typeof anime.releaseInterval === 'number' &&
        anime.releaseInterval > 0 &&
        typeof anime.season === 'number' &&
        anime.season > 0 &&
        typeof anime.episodeStart === 'number' &&
        anime.episodeStart > 0 &&
        isValidDate(anime.startDate)
      );
    } catch {
      return false;
    }
  });
}

/**
 * Safe storage operation wrapper
 */
export function safeStorageOperation<T>(
  operation: () => T,
  fallback: T,
  errorMessage?: string
): T {
  try {
    return operation();
  } catch (error) {
    console.error(errorMessage || 'Storage operation failed:', error);
    return fallback;
  }
}

/**
 * Save all animes (for external use with auto-save)
 */
export function saveAllAnimes(animes: Anime[]): void {
  try {
    const validated = validateAnimeData(animes);
    saveAnimes(validated);
  } catch (error) {
    console.error('Failed to save animes:', error);
    throw error;
  }
}

/**
 * Get watched status for all events
 */
export function getWatchedEvents(): Record<string, boolean> {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return {};

    const parsed: StorageData = JSON.parse(data);
    return parsed.watchedEvents || {};
  } catch (error) {
    console.warn('Failed to load watched events:', error);
    return {};
  }
}

/**
 * Set watched status for an event
 */
export function setEventWatched(eventId: string, watched: boolean): void {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      initializeStorage();
      return;
    }

    const parsed: StorageData = JSON.parse(data);
    const watchedEvents = parsed.watchedEvents || {};

    if (watched) {
      watchedEvents[eventId] = true;
    } else {
      delete watchedEvents[eventId];
    }

    parsed.watchedEvents = watchedEvents;
    parsed.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  } catch (error) {
    console.error('Failed to set watched status:', error);
    throw error;
  }
}
