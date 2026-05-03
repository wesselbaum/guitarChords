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

## Completion Checklist

Before marking any task done:

- [ ] Failing test written FIRST, confirmed failing
- [ ] Implementation is minimal to pass test
- [ ] All tests green after refactor
- [ ] No `any` types, no debug artifacts, no files > 200 lines
- [ ] No unused imports or variables
