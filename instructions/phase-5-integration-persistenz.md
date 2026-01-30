# Phase 5 – Integration & Persistenz

## Ziel
Alle Komponenten zusammenführen und vollständige Datenpersistenz sicherstellen.

## Aufgaben

### 1. Vollständiger Data Flow

#### Component Hierarchy
```
App (page.tsx)
├── AnimeTracker (main component)
│   ├── Header
│   │   └── AddAnimeButton
│   ├── Calendar
│   │   └── CalendarDay[]
│   │       └── EventBadge[]
│   └── AddAnimeModal
```

#### State Management
```typescript
// Top-Level State
const [animes, setAnimes] = useState<Anime[]>([]);
const [currentDate, setCurrentDate] = useState<Date>(new Date());

// Derived State
const events = useMemo(() => getAllEvents(animes), [animes]);
const monthEvents = useMemo(() =>
  filterEventsByMonth(events, currentDate),
  [events, currentDate]
);
```

### 2. localStorage Integration

#### App-Initialisierung
```typescript
useEffect(() => {
  // Beim ersten Laden
  const savedAnimes = loadAnimesFromStorage();
  setAnimes(savedAnimes);
}, []);
```

#### Auto-Save auf Änderungen
```typescript
useEffect(() => {
  // Bei jeder Anime-Änderung speichern
  saveAnimesToStorage(animes);
}, [animes]);
```

#### Storage-Funktionen erweitern
```typescript
// /lib/storage.ts
const STORAGE_KEY = 'anime-tracker-data';
const STORAGE_VERSION = 1;

interface StorageData {
  version: number;
  animes: Anime[];
  lastUpdated: string;
}

function loadAnimesFromStorage(): Anime[]
function saveAnimesToStorage(animes: Anime[]): void
function migrateStorage(oldVersion: number): void
```

### 3. CRUD-Operationen

#### Create (Add)
```typescript
function handleAddAnime(formData: AddAnimeFormData) {
  const newAnime: Anime = {
    id: generateId(),
    ...parseFormData(formData),
    createdAt: new Date().toISOString()
  };

  setAnimes(prev => [...prev, newAnime]);
  // Auto-Save durch useEffect
}
```

#### Read (Display)
- Events werden live aus Animes generiert
- Kalender zeigt gefilterte Events

#### Update (Edit)
```typescript
function handleUpdateAnime(id: string, updates: Partial<Anime>) {
  setAnimes(prev =>
    prev.map(anime =>
      anime.id === id ? { ...anime, ...updates } : anime
    )
  );
}
```

#### Delete (Remove)
```typescript
function handleDeleteAnime(id: string) {
  setAnimes(prev => prev.filter(anime => anime.id !== id));
}
```

### 4. Event-Regenerierung

#### Bei App-Start
```typescript
// Events werden nicht gespeichert, sondern neu generiert
useEffect(() => {
  const animes = loadAnimesFromStorage();
  setAnimes(animes);
  // Events automatisch durch useMemo generiert
}, []);
```

#### Bei Monatswechsel
```typescript
function handleMonthChange(newDate: Date) {
  setCurrentDate(newDate);
  // Kalender re-rendert mit neuen Events
}
```

#### Bei Anime-Änderung
```typescript
// useMemo sorgt für automatische Regenerierung
const events = useMemo(() => {
  return getAllEvents(animes);
}, [animes]);
```

### 5. Error Handling & Robustheit

#### localStorage Fehler
```typescript
function safeStorageOperation<T>(
  operation: () => T,
  fallback: T
): T {
  try {
    return operation();
  } catch (error) {
    console.error('Storage error:', error);
    showErrorToast('Speicherfehler');
    return fallback;
  }
}
```

#### Daten-Migration
```typescript
function migrateStorageIfNeeded() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return;

  const parsed = JSON.parse(data);
  if (parsed.version < STORAGE_VERSION) {
    // Migration durchführen
    const migrated = migrate(parsed);
    saveAnimesToStorage(migrated.animes);
  }
}
```

#### Korrupte Daten
```typescript
function validateAnimeData(animes: any[]): Anime[] {
  return animes.filter(anime => {
    return (
      anime.id &&
      anime.sourceUrl &&
      typeof anime.releaseInterval === 'number' &&
      isValidDate(anime.startDate)
    );
  });
}
```

## User Feedback

### Loading States
```typescript
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  setIsLoading(true);
  const animes = loadAnimesFromStorage();
  setAnimes(animes);
  setIsLoading(false);
}, []);
```

### Success/Error Toast
```typescript
import { toast } from 'sonner'; // oder shadcn/ui Toast

function handleAddAnime(data: AddAnimeFormData) {
  try {
    // ... add logic
    toast.success('Anime erfolgreich hinzugefügt!');
  } catch (error) {
    toast.error('Fehler beim Hinzufügen');
  }
}
```

### Empty States
```typescript
// Keine Animes vorhanden
{animes.length === 0 && (
  <EmptyState
    title="Noch keine Animes"
    description="Füge deinen ersten Anime hinzu"
    action={<AddAnimeButton />}
  />
)}
```

## Performance-Optimierungen

### Debounced Save
```typescript
import { useDebouncedCallback } from 'use-debounce';

const debouncedSave = useDebouncedCallback(
  (animes: Anime[]) => {
    saveAnimesToStorage(animes);
  },
  500
);

useEffect(() => {
  debouncedSave(animes);
}, [animes]);
```

### Lazy Event Generation
```typescript
// Nur Events für aktuellen + nächste 2 Monate
function getRelevantEvents(
  animes: Anime[],
  currentDate: Date
): CalendarEvent[] {
  const start = getMonthStart(currentDate);
  const end = addMonths(start, 3);

  return animes.flatMap(anime =>
    generateEvents({ anime, startDate: start, endDate: end })
  );
}
```

### Component Memoization
```typescript
const Calendar = React.memo(CalendarComponent);
const CalendarDay = React.memo(CalendarDayComponent);
```

## Testing & Validation

### Integration Tests
- [ ] Anime hinzufügen → erscheint im Kalender
- [ ] Anime löschen → verschwindet aus Kalender
- [ ] Page Reload → Daten bleiben erhalten
- [ ] Monatswechsel → korrekte Events
- [ ] Mehrere Animes → keine Konflikte

### Data Integrity Tests
- [ ] localStorage Quota überschritten
- [ ] Korrupte JSON Daten
- [ ] Fehlende Felder
- [ ] Ungültige Datums-Formate

### Cross-Browser Tests
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

## Monitoring & Debugging

### Development Tools
```typescript
if (process.env.NODE_ENV === 'development') {
  // Debug Panel
  console.log({
    animes: animes.length,
    events: events.length,
    storageSize: getStorageSize(),
  });
}
```

### Storage Inspector
```typescript
function getStorageSize(): string {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return '0 KB';
  const bytes = new Blob([data]).size;
  return `${(bytes / 1024).toFixed(2)} KB`;
}
```

## Erfolgskriterien

✅ Modal → State → Kalender Pipeline funktioniert
✅ Daten persistieren über Reload
✅ Events werden korrekt generiert und angezeigt
✅ Mehrere Animes funktionieren gleichzeitig
✅ CRUD-Operationen vollständig
✅ Error Handling verhindert Crashes
✅ Performance ist flüssig
✅ localStorage-Limit nicht überschritten
✅ Cross-Browser kompatibel

## Production Readiness

### Deployment Checklist
- [ ] TypeScript Errors: 0
- [ ] ESLint Warnings: 0
- [ ] Build erfolgreich
- [ ] Lighthouse Score > 90
- [ ] Keine Console Errors
- [ ] localStorage funktioniert
- [ ] Mobile responsive

### Optional Enhancements
- Export/Import Funktion (JSON Download)
- Backup-Reminder
- Data Compression
- IndexedDB als Fallback

## Nächste Phase
Nach Abschluss → **Phase 6: UX-Feinschliff (optional)**
