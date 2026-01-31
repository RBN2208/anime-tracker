export interface Anime {
  id: string;                    // Unique ID (UUID)
  title?: string;                // Optional, falls aus URL extrahierbar
  sourceUrl: string;             // Pflichtfeld
  season: number;                // Staffel-Nummer
  episodeStart: number;          // Start-Episode
  maxEpisodes?: number;          // Optional: Maximale Anzahl der Episoden
  releaseInterval: number;       // Tage zwischen Episoden (Default: 7)
  startDate: Date | string;      // Erstes Release-Datum
  createdAt: Date | string;      // Timestamp der Erstellung
  watchedEpisodes?: Record<string, boolean>; // Watched Status pro Episode (key: "S01E01")
}

export interface CalendarEvent {
  id: string;
  animeId: string;              // Referenz zum Anime
  date: Date | string;          // Release-Datum
  episodeNumber: number;        // Episode-Nummer
  season: number;               // Staffel
  title?: string;               // Anime-Titel
  sourceUrl?: string;           // URL zur Quelle
  watched?: boolean;            // Watched Status vom Anime
}
