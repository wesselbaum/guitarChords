# Guitar Chords

**Live:** https://wesselbaum.github.io/guitarChords/

Browser-based guitar chord reference app for beginners. Browse a built-in chord library, pick chords as a "cheat sheet" for songs, and create custom chords with a visual fretboard editor. Save songs, switch themes (light/dark/system), and export/import data as JSON. No backend — pure static SPA.

## Features

- **Chord Library** — 42 built-in chords across 11 categories (open, barre, 7th, sus, add, dim, power, aug, and more). Filter by root note or search by name.
- **Pick Chords** — Select chords from the library to build a cheat sheet for any song. No duplicates, no ordering fuss.
- **Song Management** — Save named songs, load them later, or delete them.
- **Visual Chord Editor** — Interactive SVG fretboard: click frets to place fingers, toggle open/muted strings, set start fret, auto-detected barres. Create and save custom chords.
- **Dark Mode** — Three-way toggle: light, dark, or follow system preference.
- **Export/Import** — Download all custom chords, songs, and settings as a single JSON file. Import to restore.
- **Keyboard Shortcuts** — `/` to search, `Esc` to close, `Ctrl+E` for editor, `Ctrl+P` to print, `Ctrl+Shift+D` to toggle dark mode.
- **Print View** — Clean chord sheet output with no UI chrome.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI framework |
| TypeScript 6 | Type safety |
| Vite 8 | Build tool and dev server |
| Tailwind CSS 3 | Utility-first styling |
| Vitest | Testing (with React Testing Library) |
| localStorage | Client-side persistence |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install and Run

```bash
git clone git@github.com:wesselbaum/guitarChords.git
cd guitarChords
npm install
npm run dev
```

Open `http://localhost:5173/guitarChords/` in your browser.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run lint` | Lint with ESLint |
| `npm run typecheck` | Type-check without emitting |

## Project Structure

```
src/
├── App.tsx                  # Root component, layout, tab routing
├── types/chord.ts           # Shared TypeScript interfaces
├── data/defaultChords.ts    # 42 built-in chords
├── hooks/
│   ├── useAppStore.ts       # State management + localStorage persistence
│   ├── useTheme.ts          # Theme state (light/dark/system)
│   └── useKeyboardShortcuts.ts
├── components/
│   ├── ChordLibrary.tsx     # Sidebar: search, filter, chord grid
│   ├── ChordCard.tsx        # Single chord card with actions
│   ├── ChordDiagram.tsx     # SVG chord diagram (read-only)
│   ├── ChordEditor.tsx      # Chord creation/editing form
│   ├── EditorFretboard.tsx  # Interactive SVG fretboard
│   ├── PickedChordsView.tsx # Main view: picked chords grid
│   ├── SongManager.tsx      # Saved songs list
│   ├── ViewTabs.tsx         # Tab navigation
│   ├── ThemeToggle.tsx      # Theme cycle button
│   ├── ExportImport.tsx     # Export/Import buttons
│   └── FingerLegend.tsx     # Finger color legend
```

## License

[MIT](LICENSE)
