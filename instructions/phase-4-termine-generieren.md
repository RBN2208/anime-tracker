# Phase 4 – Logik: Termine generieren

## Ziel
Kerngeschäftslogik implementieren – automatische Berechnung von Release-Terminen.

## Aufgaben

### 1. Event-Generator Funktion
Erstelle `/lib/event-generator.ts`:

```typescript
interface GenerateEventsOptions {
  anime: Anime;
  startDate: Date;
  endDate: Date;        // Bis wann generieren (z.B. +3 Monate)
  maxEpisodes?: number; // Optional: Episode-Limit
}

function generateEvents(options: GenerateEventsOptions): CalendarEvent[]
```

### 2. Release-Berechnung

#### Basis-Algorithmus
```typescript
1. Startdatum des Anime
2. For-Schleife über Episode-Zähler
3. Datum += releaseInterval (Tage)
4. Event-Objekt erstellen
5. Bis endDate erreicht
```

#### Episode-Nummerierung
- Start bei `episodeStart`
- Inkrementell hochzählen
- Season berücksichtigen

#### Datums-Arithmetik
```typescript
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
```

### 3. Multi-Anime Support

#### Zentrale Event-Aggregation
```typescript
function getAllEvents(animes: Anime[]): CalendarEvent[] {
  return animes.flatMap(anime =>
    generateEvents({ anime, startDate: new Date(), endDate: getEndDate() })
  );
}
```

#### Sortierung
- Events nach Datum sortieren
- Gleiche Tage: Alphabetisch nach Titel

### 4. Zeitraum-Bestimmung

#### Generierungs-Fenster
```typescript
- Standard: Aktueller Monat + 3 Monate
- Dynamisch: Bei Monatswechsel neu berechnen
- Performance: Nicht zu weit in Zukunft
```

#### Update-Strategie
- Bei neuem Anime: Events generieren
- Bei Monatswechsel: Neu berechnen
- Bei App-Start: Initialisierung

### 5. Edge Cases

#### Monatsgrenzen
```typescript
- 31. Januar + 7 Tage = 7. Februar ✓
- Kein "31. Februar" Problem
- JavaScript Date handled automatisch
```

#### Unregelmäßige Intervalle
```typescript
- Intervall = 7 Tage (wöchentlich)
- Intervall = 1 Tag (täglich)
- Intervall = 14 Tage (bi-weekly)
```

#### Staffelwechsel
```typescript
- Optional: Staffelende erkennen
- Neue Staffel = neuer Anime-Eintrag
- Aktuell: Unbegrenzte Episode-Folge
```

## Performance-Optimierungen

### Caching
```typescript
- Generierte Events zwischenspeichern
- Nur bei Änderungen neu berechnen
- useMemo für teure Berechnungen
```

### Lazy Generation
```typescript
- Nur sichtbarer Zeitraum generiert
- On-Demand bei Navigation
- Background-Update für kommende Monate
```

### Memoization
```typescript
import { useMemo } from 'react';

const events = useMemo(() =>
  getAllEvents(animes),
  [animes]
);
```

## Datum-Utilities erweitern

### Neue Hilfsfunktionen (`/lib/date-utils.ts`)
```typescript
- getMonthStart(date: Date): Date
- getMonthEnd(date: Date): Date
- getDateRange(start: Date, end: Date): Date[]
- isWithinRange(date: Date, start: Date, end: Date): boolean
- getWeekNumber(date: Date): number
```

## Kalender-Integration

### Event-Mapping
```typescript
function mapEventsToCalendar(
  events: CalendarEvent[],
  month: number,
  year: number
): Map<string, CalendarEvent[]>

// Key: "YYYY-MM-DD"
// Value: Array von Events an diesem Tag
```

### Rendering-Optimierung
```typescript
- Map statt Array-Filter für O(1) Lookup
- Nur Events des aktuellen Monats im State
- Rest in localStorage
```

## Testing & Validierung

### Unit Tests
```typescript
describe('generateEvents', () => {
  test('weekly intervals', () => {
    // Start: 1. Jan, Interval: 7
    // Erwartung: 1., 8., 15., 22., 29. Jan
  });

  test('month boundaries', () => {
    // 29. Jan + 7 = 5. Feb
  });

  test('leap years', () => {
    // 29. Feb 2024 + 365 = 29. Feb 2025? Nein!
  });
});
```

### Edge Case Testing
- [ ] Schaltjahre
- [ ] Jahreswechsel
- [ ] Sommerzeit-Umstellung
- [ ] Sehr lange Intervalle (365 Tage)
- [ ] Sehr kurze Intervalle (1 Tag)

## Datenstruktur-Beispiel

### Input
```typescript
{
  id: "abc123",
  title: "One Piece",
  sourceUrl: "https://...",
  season: 1,
  episodeStart: 1,
  releaseInterval: 7,
  startDate: "2026-01-29"
}
```

### Output
```typescript
[
  {
    id: "event1",
    animeId: "abc123",
    date: "2026-01-29",
    episodeNumber: 1,
    season: 1,
    title: "One Piece"
  },
  {
    id: "event2",
    animeId: "abc123",
    date: "2026-02-05",
    episodeNumber: 2,
    season: 1,
    title: "One Piece"
  },
  // ... weitere Events
]
```

## State-Updates

### React State Pattern
```typescript
const [animes, setAnimes] = useState<Anime[]>([]);
const [events, setEvents] = useState<CalendarEvent[]>([]);

useEffect(() => {
  const generatedEvents = getAllEvents(animes);
  setEvents(generatedEvents);
}, [animes]);
```

### Persistenz
- Events nicht in localStorage speichern
- Nur Animes speichern
- Events on-the-fly generieren

## Erfolgskriterien

✅ Events werden korrekt berechnet
✅ Mehrere Animes funktionieren parallel
✅ Monatsgrenzen korrekt gehandhabt
✅ Jahresgrenzen korrekt gehandhabt
✅ Performance ist akzeptabel (< 100ms)
✅ Events erscheinen im Kalender
✅ Datum-Arithmetik ist korrekt
✅ Keine Memory Leaks

## Debug-Tools

### Console Logging
```typescript
console.log('Generated events:', events.length);
console.log('Date range:', startDate, '→', endDate);
```

### Visual Debug
- Event-Counter im UI
- Datum-Range Anzeige
- Performance Metrics

## Nächste Phase
Nach Abschluss → **Phase 5: Integration & Persistenz**
