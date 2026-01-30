# Phase 0 – Projektgrundlagen (Basis)

## Ziel
Technische Basis schaffen, auf der alle weiteren Phasen aufbauen.

## Aufgaben

### 1. Next.js Projekt initialisieren
- Next.js mit App Router (nicht Pages Router)
- TypeScript aktivieren
- Aktuellste stabile Version verwenden

### 2. Tailwind CSS integrieren
- Tailwind CSS installieren und konfigurieren
- PostCSS Setup verifizieren
- Basis-Config in `tailwind.config.ts` anlegen

### 3. shadcn/ui Installation
- shadcn/ui CLI verwenden
- Basis-Komponenten System einrichten
- Theme-Config festlegen (Light/Dark Mode Support)

### 4. Projektstruktur anlegen
```
/app
  - page.tsx (Hauptseite)
  - layout.tsx (Root Layout)
  - globals.css
/components
  - /ui (shadcn Komponenten)
  - (spätere Custom Components)
/lib
  - utils.ts
  - (spätere Business Logic)
/types
  - index.ts (Type Definitionen)
```

### 5. Globale Styles festlegen
- CSS Variables für Theme-Farben
- Base Styles in globals.css
- shadcn/ui Theme-Integration
- Responsive Breakpoints definieren

### 6. Lokalen Dev-Server testen
- `npm run dev` erfolgreich ausführbar
- Keine TypeScript-Fehler
- Hot Reload funktioniert

## Wichtige Punkte

### Code-Qualität
- Strikte TypeScript-Konfiguration (`strict: true`)
- ESLint konfigurieren
- Prettier für Code-Formatierung

### Performance
- Keine unnötigen Dependencies
- Tree-shaking aktiviert
- Production Build testen

### Dokumentation
- README.md mit Setup-Anleitung
- Package.json Scripts dokumentieren
- Basis-Architektur dokumentieren

### Best Practices
- Klare Naming Conventions etablieren
- Component-Struktur festlegen (Client vs Server Components)
- Import-Aliase konfigurieren (@/ für root)

## Erfolgskriterien

✅ Projekt läuft fehlerfrei lokal
✅ Leeres Onepager-Layout ist sichtbar
✅ Tailwind CSS funktioniert
✅ shadcn/ui Components sind importierbar
✅ TypeScript kompiliert ohne Fehler
✅ Klare Ordnerstruktur vorhanden

## Nächste Phase
Nach Abschluss → **Phase 1: Datenmodell & State-Konzept**
