# Phase 3 – Anime hinzufügen (Modal & Form)

## Ziel
Datenerfassung durch ein benutzerfreundliches Modal-Formular ermöglichen.

## Aufgaben

### 1. Add-Anime Button
- Floating Action Button (FAB) oder Top-Bar Button
- Prominent platziert, immer sichtbar
- Icon: Plus oder "Anime hinzufügen" Text

### 2. Modal-Komponente
Erstelle `/components/add-anime-modal.tsx`:
- shadcn/ui `Dialog` Component nutzen
- Controlled Component (open State)
- Schließen via X-Button oder Backdrop-Click
- Form Submit schließt Modal

### 3. Formular-Felder

#### URL (Pflichtfeld)
```typescript
- Input Type: text
- Validation: Required, URL-Format
- Placeholder: "https://aniworld.to/anime/stream/..."
- Auto-Focus beim Öffnen
```

#### Release-Intervall
```typescript
- Input Type: number
- Default: 7 Tage
- Min: 1, Max: 365
- Label: "Release-Intervall (Tage)"
```

#### Startdatum
```typescript
- Input Type: date oder DatePicker
- Default: Heute
- Label: "Erstes Release-Datum"
- Min: Heute (keine vergangenen Daten)
```

#### Staffel (Optional, extrahiert)
```typescript
- Input Type: number
- Auto-Fill aus URL
- Überschreibbar
- Default: 1
```

#### Start-Episode (Optional, extrahiert)
```typescript
- Input Type: number
- Auto-Fill aus URL
- Überschreibbar
- Default: 1
```

### 4. URL-Parsing
Implementiere `/lib/url-parser.ts`:
```typescript
interface ParsedAnimeUrl {
  season?: number;
  episode?: number;
  title?: string;
}

function parseAnimeUrl(url: string): ParsedAnimeUrl
```

**Beispiel-URLs:**
- `aniworld.to/anime/stream/one-piece/staffel-1/episode-1`
- Extrahiere: season=1, episode=1, title="one-piece"

### 5. Form-Validierung

#### Client-Side Validation
- Required Felder prüfen
- URL-Format validieren
- Positive Zahlen für Intervall/Episode/Season
- Datum nicht in Vergangenheit

#### Error States
- Inline-Validierung bei Blur
- Error Messages unter Inputs
- Submit-Button disabled bei Fehlern

#### Success Flow
- Anime-Objekt erstellen
- ID generieren
- Zu State hinzufügen
- localStorage aktualisieren
- Modal schließen
- Success Toast anzeigen

## UI/UX Details

### Modal Layout
```
┌───────────────────────────────────────┐
│  Anime hinzufügen              [X]    │
├───────────────────────────────────────┤
│                                       │
│  URL *                                │
│  [_____________________________]      │
│                                       │
│  Release-Intervall (Tage)             │
│  [7]                                  │
│                                       │
│  Startdatum                           │
│  [29.01.2026]                         │
│                                       │
│  Staffel                              │
│  [1]                                  │
│                                       │
│  Start-Episode                        │
│  [1]                                  │
│                                       │
│          [Abbrechen]  [Hinzufügen]    │
└───────────────────────────────────────┘
```

### Styling
- Modal zentriert auf Bildschirm
- Backdrop mit Blur-Effect
- Form-Spacing konsistent
- Focus States für alle Inputs

### Responsive
- Mobile: Full-Screen Modal
- Desktop: Zentrierter Dialog (max-width 500px)

## shadcn/ui Komponenten

### Benötigte Components
- `Dialog` (DialogTrigger, DialogContent, DialogHeader)
- `Input` für Text/Number/Date
- `Label` für Form-Labels
- `Button` für Submit/Cancel
- `Form` für Validation (react-hook-form Integration)

### Optional
- `Toast` für Success/Error Messages
- `DatePicker` statt native Date Input
- `Select` für Release-Intervall Presets

## Form State Management

### React Hook Form
```typescript
import { useForm } from 'react-hook-form'

interface AddAnimeFormData {
  url: string;
  releaseInterval: number;
  startDate: string;
  season?: number;
  episodeStart?: number;
}
```

### Validation Schema
- Zod oder Yup für Type-Safe Validation
- Error Messages lokalisiert

## Auto-Fill Logik

### URL-Eingabe → Auto-Extract
1. User fügt URL ein
2. onBlur triggert Parsing
3. Staffel/Episode Felder werden ausgefüllt
4. User kann Werte überschreiben

### Smart Defaults
- Intervall: 7 Tage (wöchentlich)
- Startdatum: Heute
- Season: 1
- Episode: 1

## Error Handling

### Netzwerk-Fehler
- localStorage voll → Error Toast
- Parsing fehlgeschlagen → Manual Input

### User-Feedback
- Loading State während Parse
- Success Animation nach Add
- Clear Error Messages

## Accessibility

### Keyboard Navigation
- Tab durch Felder
- Enter für Submit
- Escape für Close

### ARIA Labels
- Form Labels korrekt verknüpft
- Error Messages aria-describedby
- Required Fields markiert

### Screen Reader
- Meaningful Labels
- Error Announcements
- Success Confirmation

## Erfolgskriterien

✅ Modal öffnet/schließt korrekt
✅ Alle Formular-Felder funktional
✅ Validierung verhindert fehlerhafte Eingaben
✅ URL-Parsing extrahiert Daten korrekt
✅ Anime wird zu State hinzugefügt
✅ Modal schließt nach erfolgreichem Submit
✅ Error States sind klar kommuniziert
✅ Responsive auf allen Geräten

## Testing-Checkliste

- [ ] Modal öffnen/schließen
- [ ] Required Validation
- [ ] URL Parsing korrekt
- [ ] Datum-Validierung
- [ ] Number Constraints
- [ ] Submit funktioniert
- [ ] Cancel funktioniert
- [ ] Keyboard Navigation
- [ ] Error Messages sichtbar

## Nächste Phase
Nach Abschluss → **Phase 4: Logik – Termine generieren**
