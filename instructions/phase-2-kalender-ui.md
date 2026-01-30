# Phase 2 – Kalender (UI & Layout)

## Ziel
Visuelle Hauptkomponente der Anwendung implementieren – einen funktionalen Monatskalender.

## Aufgaben

### 1. Kalender-Komponente erstellen
Erstelle `/components/calendar.tsx`:
- Monatsansicht als Grid-Layout
- 7 Spalten (Mo-So) × 5-6 Reihen
- Responsive Design

### 2. Tag-Komponente (CalendarDay)
Erstelle `/components/calendar-day.tsx`:
- Einzelne Kalender-Zelle
- Tages-Nummer anzeigen
- Container für Anime-Events
- Styling für verschiedene Zustände

### 3. Kalender-Logik
Implementiere in `/lib/calendar-utils.ts`:
```typescript
- getMonthDays(year: number, month: number): Date[]
- getWeekdayNames(): string[]
- isToday(date: Date): boolean
- isSameDay(date1: Date, date2: Date): boolean
- getMonthName(month: number): string
```

### 4. Navigation
- Monat vor/zurück Buttons
- Aktuelles Datum Header
- "Heute" Button zum Zurückspringen

### 5. Event-Rendering
- Events aus State in Tage mappen
- Mehrere Events pro Tag anzeigen
- Visual Grouping bei vielen Events

## UI/UX Design

### Layout-Struktur
```
┌─────────────────────────────────────────┐
│  ← Januar 2026 →         [Heute]        │
├─────────────────────────────────────────┤
│  Mo   Di   Mi   Do   Fr   Sa   So       │
├─────────────────────────────────────────┤
│  29   30   31   1    2    3    4        │
│                 📺                       │
│  5    6    7    8    9    10   11       │
│       📺                                 │
│  ...                                     │
└─────────────────────────────────────────┘
```

### Styling-Konzept
- Heutiger Tag: Highlight mit Accent-Color
- Vergangene Tage: Reduzierte Opacity
- Tage mit Events: Visual Indicator
- Leere Tage: Neutral Background

### Responsive Breakpoints
- **Mobile** (< 640px): Kompakte Ansicht, kleinere Zellen
- **Tablet** (640px-1024px): Standard Grid
- **Desktop** (> 1024px): Großzügiges Layout

## shadcn/ui Komponenten nutzen

### Benötigte Components
- `Card` für Kalender-Container
- `Button` für Navigation
- `Badge` für Event-Anzeige
- `Separator` für Header-Trennung

### Theme Integration
- Dark Mode Support
- CSS Variables nutzen
- Hover/Focus States

## State-Integration

### Props für Calendar Component
```typescript
interface CalendarProps {
  events: CalendarEvent[];
  currentDate?: Date;
  onDateChange?: (date: Date) => void;
}
```

### Event-Display Logic
- Filter Events nach Datum
- Sortierung nach Zeit/Priorität
- Truncate bei vielen Events

## Performance-Optimierungen

### Memoization
- React.memo für CalendarDay
- useMemo für teure Berechnungen
- useCallback für Event Handlers

### Virtual Scrolling
- Nur aktueller Monat gerendert
- Lazy Loading bei Monatswechsel

## Accessibility

### ARIA Labels
- Semantische HTML-Struktur
- aria-label für Buttons
- aria-current für heutigen Tag

### Keyboard Navigation
- Tab-Navigation funktioniert
- Enter/Space für Interaktionen
- Pfeiltasten für Monatswechsel

## Edge Cases

### Monatsgrenzen
- Tage aus Vormonat/Folgemonat ausgrauen
- Korrekte Zuordnung bei Monatsübergängen

### Unterschiedliche Monatslängen
- 28, 29, 30, 31 Tage korrekt handhaben
- Schaltjahre berücksichtigen

### Keine Events
- Empty State anzeigen
- Call-to-Action für ersten Anime

## Erfolgskriterien

✅ Kalender rendert korrekt für beliebigen Monat
✅ Aktueller Tag ist hervorgehoben
✅ Navigation vor/zurück funktioniert
✅ Events werden an korrektem Tag angezeigt
✅ Responsive auf allen Bildschirmgrößen
✅ Performance ist flüssig (60fps)
✅ Dark Mode funktioniert

## Testing-Checkliste

- [ ] Kalender zeigt aktuellen Monat
- [ ] Monatswechsel funktioniert
- [ ] Schaltjahre korrekt
- [ ] Heute-Highlight sichtbar
- [ ] Mehrere Events pro Tag
- [ ] Mobile Ansicht funktional

## Nächste Phase
Nach Abschluss → **Phase 3: Anime hinzufügen (Modal & Form)**
