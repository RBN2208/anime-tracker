Nachfolgend eine **strukturierte, agententaugliche Instruction**, mit klarer Phaseneinteilung und expliziten Arbeitsaufträgen. Sie ist so formuliert, dass ein KI-Agent das Projekt **schrittweise, deterministisch und überprüfbar** umsetzen kann.

---

**Rolle des KI-Agents**
Du agierst als Senior Frontend Engineer mit Fokus auf Next.js (App Router) und shadcn/ui. Ziel ist der Aufbau eines funktionsfähigen Onepager-Prototyps namens **AnimeTracker**.
Arbeite die Phasen **streng sequenziell** ab. Beginne eine neue Phase erst, wenn die vorherige vollständig abgeschlossen ist.

---

## Phase 0 – Projektgrundlagen (Basis)

Ziel: Technische Basis schaffen, auf der alle weiteren Phasen aufbauen.

Aufgaben:

* Initialisiere ein Next.js Projekt (App Router).
* Integriere Tailwind CSS.
* Installiere und konfiguriere shadcn/ui.
* Lege eine saubere Projektstruktur an:

    * `/app`
    * `/components`
    * `/lib`
    * `/types`
* Lege globale Styles und Theme-Defaults fest.
* Stelle sicher, dass das Projekt lokal lauffähig ist.

Ergebnis:

* Leeres Onepager-Layout mit funktionierendem Styling.
* Keine Business-Logik.

---

## Phase 1 – Datenmodell & State-Konzept

Ziel: Klare, stabile Datenbasis definieren.

Aufgaben:

* Definiere ein Anime-Datenmodell, z. B.:

    * id
    * title (optional, falls aus URL extrahierbar)
    * sourceUrl
    * season
    * episodeStart
    * releaseInterval (Default: 7 Tage)
    * startDate
* Definiere ein Kalender-Event-Modell (Anime + Datum).
* Entscheide dich für Local State + localStorage (kein Backend).
* Implementiere eine Utility-Schicht für:

    * Lesen aus localStorage
    * Schreiben in localStorage
    * Initialisierung beim App-Start

Ergebnis:

* Sauber typisierte Models.
* Persistenter Zustand über Page Reloads hinweg.

---

## Phase 2 – Kalender (UI & Layout)

Ziel: Visuelle Hauptkomponente der Anwendung.

Aufgaben:

* Implementiere eine Monatskalender-Ansicht als Grid.
* Jeder Tag ist eine eigene UI-Einheit (Card oder Cell).
* Hebe den aktuellen Tag visuell hervor.
* Zeige pro Tag alle zugehörigen Anime-Einträge an.
* Stelle sicher, dass der Kalender rein aus State gerendert wird.

Constraints:

* Keine Interaktion außer Anzeige.
* Noch kein Hinzufügen/Löschen.

Ergebnis:

* Statischer, korrekt gerenderter Monatskalender.

---

## Phase 3 – Anime hinzufügen (Modal & Form)

Ziel: Datenerfassung ermöglichen.

Aufgaben:

* Implementiere einen „Anime hinzufügen“ Button.
* Öffne ein shadcn/ui Modal (Dialog).
* Formularfelder:

    * URL (Pflichtfeld)
    * Release-Intervall (Number, Default 7)
    * Startdatum (optional, Default: heute)
* Validiere die Eingaben minimal (required, number > 0).
* Extrahiere aus der URL:

    * Staffel
    * Episode (Startwert)
* Erzeuge ein Anime-Objekt aus den Formdaten.

Ergebnis:

* Funktionales Modal, das valide Anime-Objekte erzeugt.

---

## Phase 4 – Logik: Termine generieren

Ziel: Kerngeschäftslogik des Trackers.

Aufgaben:

* Implementiere eine Funktion, die aus einem Anime:

    * fortlaufende Release-Termine berechnet
    * basierend auf Startdatum + Release-Intervall
* Trage die generierten Termine in den Kalender ein.
* Stelle sicher, dass:

    * mehrere Anime parallel funktionieren
    * Termine korrekt über Monatsgrenzen hinweg berechnet werden

Ergebnis:

* Automatische, korrekte Eintragung zukünftiger Episoden.

---

## Phase 5 – Integration & Persistenz

Ziel: Alles zusammenführen.

Aufgaben:

* Verbinde Modal → State → Kalender.
* Speichere neue Anime dauerhaft im localStorage.
* Lade gespeicherte Anime beim App-Start.
* Rechne Kalenderdaten bei Reload korrekt neu.

Ergebnis:

* Voll funktionsfähiger AnimeTracker-Onepager.

---

## Phase 6 – UX-Feinschliff (optional, nachrangig)

Ziel: Bedienbarkeit verbessern.

Optionale Aufgaben:

* Leere Tage visuell abschwächen.
* Mehrere Anime pro Tag klar trennen.
* Hover- oder Focus-States verbessern.
* Fehlerzustände im Formular anzeigen.

---

**Arbeitsregeln für den KI-Agenten**

* Keine unnötigen Libraries hinzufügen.
* Kein Backend.
* Kein Auth.
* Fokus auf Klarheit, Wartbarkeit, Lesbarkeit.
* Code kommentieren, wo Logik nicht trivial ist.
* Jede Phase isoliert abschließen, bevor die nächste beginnt.
