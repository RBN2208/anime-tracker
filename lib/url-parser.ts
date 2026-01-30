export interface ParsedAnimeUrl {
  season?: number;
  episode?: number;
  title?: string;
}

/**
 * Parses an aniworld.to URL to extract anime metadata
 * @param url - The anime URL to parse
 * @returns Parsed anime metadata including season, episode, and title
 * @example
 * parseAnimeUrl("aniworld.to/anime/stream/one-piece/staffel-1/episode-1")
 * // Returns: { season: 1, episode: 1, title: "one-piece" }
 */
export function parseAnimeUrl(url: string): ParsedAnimeUrl {
  const result: ParsedAnimeUrl = {};

  try {
    // Remove protocol and www if present
    const cleanUrl = url.replace(/^(https?:\/\/)?(www\.)?/, "");

    // Match patterns like: aniworld.to/anime/stream/{title}/staffel-{season}/episode-{episode}
    const regex =
      /aniworld\.to\/anime\/stream\/([^\/]+)(?:\/staffel-(\d+))?(?:\/episode-(\d+))?/i;
    const match = cleanUrl.match(regex);

    if (match) {
      const [, title, season, episode] = match;

      // Extract title
      if (title) {
        result.title = title;
      }

      // Extract season number
      if (season) {
        const seasonNum = parseInt(season, 10);
        if (!isNaN(seasonNum) && seasonNum > 0) {
          result.season = seasonNum;
        }
      }

      // Extract episode number
      if (episode) {
        const episodeNum = parseInt(episode, 10);
        if (!isNaN(episodeNum) && episodeNum > 0) {
          result.episode = episodeNum;
        }
      }
    }
  } catch (error) {
    // Return empty result if parsing fails
    console.error("Error parsing anime URL:", error);
  }

  return result;
}
