# Guitar Chord Reference App — Technical Implementation Plan

## Overview

Browser-based chord reference application for guitar beginners. Users browse a chord library, select chords for a song as a "cheat sheet," and create custom chords via a visual editor. All data persists in localStorage with JSON export/import.

Hosted on GitHub Pages at `username.github.io/guitarChords/`.

## Tech Stack

| Technology | Version/Details | Purpose |
|------------|----------------|---------|
| React | 18.x | UI framework, component-based SPA |
| TypeScript | 5.x | Type safety |
| Vite | 5.x | Build tool, dev server, GitHub Pages deploy |
| Tailwind CSS | 3.x | Utility-first styling, dark mode support via `dark:` classes |
| localStorage | Browser API | Client-side persistence |
| GitHub Pages | Static hosting | Production deployment |

**No backend. No database. No external API. Pure static SPA.**

## Deployment

- **Repo name:** `guitarChords`
- **GitHub Pages URL:** `username.github.io/guitarChords/`
- **Vite config base path:** `/guitarChords/`
- **Deploy method:** Build to `dist/`, push to `gh-pages` branch (via `gh-pages` npm package or GitHub Actions)

## Data Model

```typescript
interface Chord {
  id: string;
  name: string;              // Display name: "Am", "C#m7", "Dsus4"
  rootNote: string;          // Root for filtering: "A", "C#", "D"
  category: string;          // "open" | "barre" | "7th" | "sus" | "add" | "dim" | "power" | "aug" | "min" | "maj"
  strings: (number | null)[]; // Length 6 array [E,A,D,G,B,e] — fret number (0=open played) or null (muted/not played)
  fingers: (number | null)[]; // Length 6 array — finger 1-4 per string, null if open/muted
  startFret: number;         // Starting fret for display (1 for open chords, higher for barre positions)
  barres: number[];          // Fret numbers where a barre spans multiple strings
  isCustom: boolean;         // false = default chord, true = user-created
}

interface Song {
  id: string;
  name: string;
  chordIds: string[];        // References to chord IDs (unordered, unique — cheat sheet style)
  createdAt: number;         // Unix timestamp
}

interface AppData {
  customChords: Chord[];
  songs: Song[];
  hiddenDefaultChordIds: string[];  // IDs of default chords user has hidden
  theme: 'light' | 'dark' | 'system';
}
```

## Architecture

### Project Structure

```
guitarChords/
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── src/
│   ├── main.tsx                    # Entry point
│   ├── App.tsx                     # Root component, layout shell, routing between views
│   ├── components/
│   │   ├── ChordLibrary.tsx        # Sidebar: root note filter, search, chord list
│   │   ├── ChordCard.tsx           # Single chord display (name + diagram), used in song view
│   │   ├── ChordDiagram.tsx        # SVG vertical fretboard rendering (read-only)
│   │   ├── ChordEditor.tsx         # Interactive SVG fretboard for creating/editing chords
│   │   ├── SongView.tsx            # Main area: song selector, chord cheat sheet, save/load
│   │   ├── ExportImport.tsx        # JSON download/upload buttons
│   │   ├── ThemeToggle.tsx         # Dark/light/system toggle
│   │   └── KeyboardShortcuts.tsx   # Shortcut overlay and handler
│   ├── data/
│   │   └── defaultChords.ts        # ~50+ hardcoded default chords
│   ├── hooks/
│   │   └── useAppStore.ts          # localStorage persistence, CRUD operations
│   ├── types/
│   │   └── chord.ts                # TypeScript interfaces (Chord, Song, AppData)
│   └── styles/
│       └── index.css               # Tailwind directives, print styles, global overrides
└── public/
    └── (static assets if needed)
```

### Layout

Desktop-first design. Sidebar + main area.

```
┌──────────────────────────────────────────────────────┐
│  Header: App Title | Theme Toggle | Export/Import    │
├──────────────┬───────────────────────────────────────┤
│              │                                       │
│  SIDEBAR     │  MAIN AREA                            │
│  ──────────  │  ─────────                            │
│  Root note   │  Switches between:                    │
│  filter:     │   • Song View (default)               │
│  [A][B][C].. │   • Chord Editor                      │
│              │                                       │
│  [Search...] │  Song View:                           │
│              │   Song name + save/load                │
│  Chord list: │   Grid of ChordCards with diagrams    │
│  ☐ Am        │   Print / Clear buttons               │
│  ☐ C         │                                       │
│  ☐ Dm        │  Chord Editor:                        │
│  ...         │   Interactive SVG fretboard            │
│              │   Name field, save button              │
│  [+ New]     │                                       │
│              │                                       │
└──────────────┴───────────────────────────────────────┘
```

Responsive: sidebar collapses to hamburger menu on mobile breakpoints.

## Feature Specifications

### 1. Chord Library (Sidebar)

- Displays all chords: defaults (not hidden) + custom
- **Root note filter:** Buttons for A, A#/Bb, B, C, C#/Db, D, D#/Eb, E, F, F#/Gb, G, G#/Ab
- **Search:** Text filter matching chord name
- Each chord item shows: small chord name, click to add to current song
- "Use as template" action on default chords: duplicates into editor for modification
- "+ New Chord" button opens editor with blank fretboard
- Custom chords are visually distinguished (badge or icon)

### 2. Chord Diagram (SVG Component)

- **Vertical orientation:** Strings vertical, frets horizontal (classic chord book style)
- 6 strings, 4-5 visible frets
- **Elements:**
  - Nut (thick line at top for open chords)
  - Fret lines (horizontal)
  - String lines (vertical)
  - Finger dots (filled circles on fret intersections) with finger number (1-4) inside
  - Open string markers (O above nut)
  - Muted string markers (X above nut)
  - Start fret number (shown left side when startFret > 1)
  - Barre indicator (curved line or elongated bar spanning strings)
  - Chord name above diagram
- Works in both light and dark themes
- Scalable: used small in sidebar/library, larger in song view and editor

### 3. Song View (Main Area — Default)

- **Song selector:** Dropdown of saved songs + "New Song" option
- **Song name input:** Editable name field
- **Chord grid:** Cards showing ChordDiagram + chord name for each selected chord
- **Actions:** Save song, Delete song, Clear chords, Print
- **Cheat sheet model:** Unique chords only, no ordering/sequencing
- Adding a chord from library that's already in the song = no-op (no duplicates)

### 4. Chord Editor (Main Area — Toggled)

- **Interactive SVG fretboard** (same visual style as ChordDiagram but larger and clickable)
- **Click on fret intersection:** Places finger dot with auto-assigned finger number (next available 1-4). Click existing dot to remove.
- **Click on string header (above nut):** Toggles Open (O) → Muted (X) → Open...
- **Finger number editing:** Small control appears near placed dot to change assigned finger
- **Barre support:** Toggle "barre mode" button, then click start and end string on same fret
- **Name field:** Text input for chord name
- **Start fret selector:** For chords higher on the neck
- **Save button:** Saves as custom chord to library
- **Template loading:** Can initialize editor from any existing chord (default or custom)

### 5. Export/Import

- **Export:** Downloads single JSON file containing full `AppData` (custom chords + songs + preferences)
- **Import:** File upload, parses JSON, loads into localStorage
- Default chords are NOT included in export (they're hardcoded in the app)
- Import replaces all custom data (with confirmation dialog)

### 6. Dark Mode

- Three states: Light / Dark / System (follows OS preference)
- Tailwind `dark:` variant classes
- Preference persisted in localStorage
- SVG diagrams adapt colors to theme

### 7. Print View

- CSS `@media print` styles
- Prints Song View as clean chord sheet: chord name + diagram, no UI chrome
- No sidebar, no buttons, no background colors
- Print button in Song View header

### 8. Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `/` | Focus search in sidebar |
| `Esc` | Close editor / clear search |
| `Ctrl+S` | Save current song or chord (context-dependent) |
| `Ctrl+E` | Toggle chord editor |
| `Ctrl+P` | Print song view |
| `Ctrl+Shift+D` | Toggle dark mode |
| `?` | Show/hide keyboard shortcuts overlay |

### 9. Default Chord Library (~50+ chords)

Organized by category. Includes at minimum:

- **Open Major:** C, D, E, G, A
- **Open Minor:** Am, Dm, Em
- **Open 7th:** A7, B7, C7, D7, E7, G7
- **Minor 7th:** Am7, Dm7, Em7
- **Major 7th:** Cmaj7, Fmaj7, Gmaj7
- **Sus:** Dsus2, Dsus4, Asus2, Asus4, Esus4
- **Add:** Cadd9, Gadd9
- **Barre Major:** F, Bb (A-shape barre), B
- **Barre Minor:** Bm, F#m, C#m
- **Power Chords:** E5, A5, D5, G5
- **Diminished:** Bdim, C#dim
- **Augmented:** Caug, Eaug

## Design Decisions Record

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Primary device | Desktop/Laptop | User practices at desk with laptop |
| Song view model | Cheat sheet (unique, unordered) | Simple reference card, not a lead sheet |
| Editor interaction | Visual SVG click | More intuitive than form-based, worth the dev effort |
| Finger assignment | Auto-assign, editable | Reduces clicks, still allows override |
| Default chord mutability | Immutable, usable as template | Prevents data loss, supports customization |
| Library organization | Root note filter + search | Natural lookup pattern: "I need a C chord" |
| Export scope | Single JSON, everything | Simple backup/restore |
| Layout | Sidebar + switchable main area | Desktop-optimized, familiar pattern |

## Implementation Order

| Step | Task | Dependencies |
|------|------|-------------|
| 1 | Project scaffold (Vite + React + TS + Tailwind + config) | None |
| 2 | TypeScript types + default chord data | None |
| 3 | Theme system (dark/light/system) | Step 1 |
| 4 | ChordDiagram SVG component (read-only) | Step 2 |
| 5 | useAppStore hook (localStorage CRUD) | Step 2 |
| 6 | ChordLibrary sidebar | Steps 4, 5 |
| 7 | SongView main area | Steps 4, 5, 6 |
| 8 | ChordEditor interactive fretboard | Steps 4, 5 |
| 9 | Export/Import | Step 5 |
| 10 | Print styles | Step 7 |
| 11 | Keyboard shortcuts | Steps 6, 7, 8 |
| 12 | Responsive polish | All above |
