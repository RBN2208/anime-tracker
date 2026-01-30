# Phase 1 – Datenmodell & State-Konzept

## Ziel
Klare, stabile Datenbasis definieren und Persistenz implementieren.

## Aufgaben

### 1. Anime-Datenmodell definieren
Erstelle TypeScript Interfaces in `/types/index.ts`:

```typescript
interface Anime {
  id: string;                    // Unique ID (UUID)
  title?: string;                // Optional, falls aus URL extrahierbar
  sourceUrl: string;             // Pflichtfeld
  season: number;                // Staffel-Nummer
  episodeStart: number;          // Start-Episode
  releaseInterval: number;       // Tage zwischen Episoden (Default: 7)
  startDate: Date | string;      // Erstes Release-Datum
  createdAt: Date | string;      // Timestamp der Erstellung
}
```

### 2. Kalender-Event-Modell definieren
```typescript
interface CalendarEvent {
  id: string;
  animeId: string;              // Referenz zum Anime
  date: Date | string;          // Release-Datum
  episodeNumber: number;        // Episode-Nummer
  season: number;               // Staffel
  title?: string;               // Anime-Titel
}
```

### 3. State-Management festlegen
- **Lokaler State**: React useState/useReducer
- **Persistenz**: localStorage (Browser API)
- **Keine** globalen State-Libraries (Redux/Zustand)
- Context API nur falls notwendig

### 4. localStorage Utility-Layer implementieren
Erstelle `/lib/storage.ts`:

```typescript
// Anime CRUD
- getAnimes(): Anime[]
- addAnime(anime: Anime): void
- updateAnime(id: string, updates: Partial<Anime>): void
- deleteAnime(id: string): void

// State Initialisierung
- initializeStorage(): void
- clearStorage(): void
```

### 5. Validierungsfunktionen
Erstelle `/lib/validation.ts`:
- URL-Validierung
- Datums-Validierung
- Zahlen-Validierung (episodeStart, season, interval)

## Wichtige Punkte

### Datenintegrität
- Alle Anime müssen eindeutige IDs haben
- Datums-Serialisierung (Date → ISO String für localStorage)
- Fehlerbehandlung beim Laden/Speichern

### Type Safety
- Strikte TypeScript Types nutzen
- Keine `any` Types
- Runtime-Validierung bei localStorage-Zugriff

### Fehlerbehandlung
- Try-Catch bei localStorage-Operationen
- Fallback auf leeres Array bei Parse-Fehlern
- Console Warnings für Developer

### Migration & Versionierung
- Schema-Version im localStorage
- Migrations-Strategie für zukünftige Änderungen

### Performance
- Debouncing bei häufigen Speicher-Operationen
- Lazy Loading von Daten wo möglich

## Utility-Funktionen

### Date Helpers (`/lib/date-utils.ts`)
- `parseDate(dateString: string): Date`
- `formatDate(date: Date): string`
- `addDays(date: Date, days: number): Date`
- `isValidDate(date: any): boolean`

### ID Generation
- `generateId(): string` (UUID v4 oder nanoid)

## Testing-Überlegungen
- localStorage Mock für Tests
- Validierungs-Tests
- Edge Cases (leere Daten, korrupte Daten)

## Erfolgskriterien

✅ Alle TypeScript Interfaces definiert
✅ localStorage Read/Write funktioniert
✅ Daten persistieren über Page Reload
✅ Validierung verhindert fehlerhafte Daten
✅ Klare Utility-Funktionen vorhanden
✅ Keine Runtime-Errors bei Storage-Ops

## Nächste Phase
Nach Abschluss → **Phase 2: Kalender (UI & Layout)**
