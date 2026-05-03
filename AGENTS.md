# AGENTS.md — guitarChords

## Project Overview

Browser-based guitar chord reference app. React 18 + TypeScript 5 + Vite 5 + Tailwind CSS 3. Pure static SPA, no backend. See `IMPLEMENTATION.md` for full spec.

## Test-Driven Development (Strict Red-Green-Refactor)

**Every code change MUST follow the Red-Green-Refactor cycle. No exceptions.**

1. **RED** — Write a failing test first. Run it. Confirm it fails. Do NOT write implementation code yet.
2. **GREEN** — Write the minimum code to make the test pass. Nothing more.
3. **REFACTOR** — Clean up code and tests while keeping all tests green.

### Rules

- Never write implementation code without a failing test that demands it.
- Never skip the "confirm it fails" step.
- One behavior per test. Test names describe behavior: `"adds chord to song when clicked"` not `"calls handleAddChord"`.
- Bug fixes: write a test that reproduces the bug FIRST, then fix.
- Refactoring: all tests must pass before AND after.

### What Does NOT Need Tests

Config files, CSS-only changes, pure type definitions, `main.tsx` entry point.

## Testing Stack

- **Vitest** + **React Testing Library** + `@testing-library/user-event` + `@testing-library/jest-dom`
- Test files co-located with source: `ComponentName.test.tsx` next to `ComponentName.tsx`

## Code Guardrails

- TypeScript strict mode. No `any`. No unexplained `@ts-ignore`.
- No files over 200 lines — extract into hooks or utilities.
- No `console.log` or debug artifacts in committed code.
- No circular dependencies.
- Export types from `src/types/` — single source of truth.
- Run `npm run test:run`, `npm run lint`, and `npm run typecheck` before committing. Zero warnings.

## Codebase Quick Reference

Use this section to skip exploratory reads on future tasks.

### Source Structure

```
src/
  App.tsx              — Root component. Header, sidebar, tab routing (picked|songs|editor)
  main.tsx             — Entry point (no tests needed)
  types/chord.ts       — All shared types (Chord incl. optional longName, Song, ThemeMode, etc.)
  data/defaultChords.ts — Built-in chord library
  hooks/
    useAppStore.ts     — Custom hook store: songs, customChords, hiddenDefaultChordIds, import/export
    useTheme.ts        — Theme state (light/dark/system) + localStorage sync
    useKeyboardShortcuts.ts — Global hotkeys (/, Esc, Ctrl+E, Ctrl+P, Ctrl+Shift+D)
  components/
    ChordLibrary.tsx   — Sidebar: search + root-note filter + chord grid + "New Chord" button
    ChordCard.tsx      — Single chord card: diagram + pick/unpick/template/delete buttons
    ChordDiagram.tsx   — SVG chord diagram renderer (read-only), shows name + optional longName
    ChordEditor.tsx    — Form: name/longName/root/category/startFret + EditorFretboard + Save/Cancel
    EditorFretboard.tsx — Interactive SVG fretboard (click frets, toggle strings, cycle fingers)
    PickedChordsView.tsx — Default main view: picked chord grid + Save as Song + Clear All
    SongManager.tsx    — Saved songs list: Load/Delete per song
    ViewTabs.tsx       — Tab navigation between Picked Chords and Saved Songs views
    ThemeToggle.tsx    — Theme cycle button (light→dark→system)
    ExportImport.tsx   — Export/Import JSON backup buttons
    FingerLegend.tsx   — Color legend for finger numbers
```

### Button Inventory

All `<button>` elements have `aria-label` and/or `title` attributes. SVG click targets in `EditorFretboard.tsx` use `data-testid` only (no `title`/`aria-label` — they are non-semantic hit zones).

### Test Patterns

- Co-located: `Component.test.tsx` next to `Component.tsx`
- Query buttons via `screen.getByRole('button', { name: /pattern/i })`
- SVG elements via `screen.getByTestId('fret-{s}-{f}')` or `'finger-btn-{i}'`
- Fixtures: inline `Chord`/`Song` objects, `vi.fn()` for callbacks

## Completion Checklist

Before marking any task done:

- [ ] Failing test written FIRST, confirmed failing
- [ ] Implementation is minimal to pass test
- [ ] All tests green after refactor
- [ ] No `any` types, no debug artifacts, no files > 200 lines
- [ ] No unused imports or variables
- [ ] AGENTS.md updated if code changes affect structure, components, buttons, or test patterns
