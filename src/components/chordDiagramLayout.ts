import type { Chord, FingerNumber } from '../types/chord'

export const SIZES = {
  sm: { width: 80, height: 100, fontSize: 10, dotRadius: 5, markerSize: 8 },
  md: { width: 120, height: 150, fontSize: 14, dotRadius: 7, markerSize: 12 },
  lg: { width: 160, height: 200, fontSize: 18, dotRadius: 9, markerSize: 14 },
}

export type DiagramSize = keyof typeof SIZES

export const STRING_COUNT = 6
export const FRET_COUNT = 5
export const PADDING_TOP = 30
export const PADDING_BOTTOM = 10
export const PADDING_LEFT = 20
export const PADDING_RIGHT = 10

export function calculateLayout(width: number, height: number) {
  const fretboardWidth = width - PADDING_LEFT - PADDING_RIGHT
  const fretboardHeight = height - PADDING_TOP - PADDING_BOTTOM
  const stringSpacing = fretboardWidth / (STRING_COUNT - 1)
  const fretSpacing = fretboardHeight / FRET_COUNT

  return { fretboardWidth, fretboardHeight, stringSpacing, fretSpacing }
}

export function getStringX(index: number, stringSpacing: number): number {
  return PADDING_LEFT + index * stringSpacing
}

export function getFretY(fret: number, fretSpacing: number): number {
  return PADDING_TOP + fret * fretSpacing
}

export function getBarreStringSet(chord: Chord): Set<number> {
  const barreStrings = new Set<number>()
  for (const barreFret of chord.barres) {
    const barreFinger = findBarreFinger(chord, barreFret)
    chord.strings.forEach((fret, i) => {
      if (fret === barreFret && chord.fingers[i] === barreFinger) {
        barreStrings.add(i)
      }
    })
  }
  return barreStrings
}

export function findBarreFinger(
  chord: Chord,
  barreFret: number
): FingerNumber {
  return (
    chord.fingers.find(
      (f, i) => f !== null && chord.strings[i] === barreFret
    ) ?? null
  )
}
