/**
 * Validate if a string is a valid URL
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validate if a value is a valid date
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
 * Validate if a number is a positive integer
 */
export function isPositiveInteger(value: unknown): boolean {
  if (typeof value !== 'number') {
    return false;
  }

  return Number.isInteger(value) && value > 0;
}

/**
 * Validate if a number is a non-negative integer (0 or positive)
 */
export function isNonNegativeInteger(value: unknown): boolean {
  if (typeof value !== 'number') {
    return false;
  }

  return Number.isInteger(value) && value >= 0;
}

/**
 * Validate season number (must be positive integer)
 */
export function isValidSeason(season: unknown): boolean {
  return isPositiveInteger(season);
}

/**
 * Validate episode number (must be positive integer)
 */
export function isValidEpisode(episode: unknown): boolean {
  return isPositiveInteger(episode);
}

/**
 * Validate release interval (must be positive integer, typically in days)
 */
export function isValidInterval(interval: unknown): boolean {
  return isPositiveInteger(interval);
}

/**
 * Validate anime data structure
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateAnimeData(data: {
  sourceUrl: string;
  season: number;
  episodeStart: number;
  releaseInterval: number;
  startDate: Date | string;
}): ValidationResult {
  const errors: string[] = [];

  if (!isValidUrl(data.sourceUrl)) {
    errors.push('Invalid source URL');
  }

  if (!isValidSeason(data.season)) {
    errors.push('Season must be a positive integer');
  }

  if (!isValidEpisode(data.episodeStart)) {
    errors.push('Episode start must be a positive integer');
  }

  if (!isValidInterval(data.releaseInterval)) {
    errors.push('Release interval must be a positive integer');
  }

  if (!isValidDate(data.startDate)) {
    errors.push('Invalid start date');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
