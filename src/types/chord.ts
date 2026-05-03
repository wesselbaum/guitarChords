export type StringFret = number | null
export type FingerNumber = 1 | 2 | 3 | 4 | null

export type RootNote =
  | 'A' | 'A#' | 'Bb'
  | 'B'
  | 'C' | 'C#' | 'Db'
  | 'D' | 'D#' | 'Eb'
  | 'E'
  | 'F' | 'F#' | 'Gb'
  | 'G' | 'G#' | 'Ab'

export type ChordCategory =
  | 'open'
  | 'barre'
  | '7th'
  | 'maj7'
  | 'min7'
  | 'sus'
  | 'add'
  | 'dim'
  | 'aug'
  | 'power'
  | 'minor'

export interface Chord {
  id: string
  name: string
  longName?: string
  rootNote: RootNote
  category: ChordCategory
  strings: [StringFret, StringFret, StringFret, StringFret, StringFret, StringFret]
  fingers: [FingerNumber, FingerNumber, FingerNumber, FingerNumber, FingerNumber, FingerNumber]
  startFret: number
  barres: number[]
  isCustom: boolean
}

export interface Song {
  id: string
  name: string
  chordIds: string[]
  createdAt: number
}

export type ThemeMode = 'light' | 'dark' | 'system'

export interface AppData {
  customChords: Chord[]
  songs: Song[]
  hiddenDefaultChordIds: string[]
  theme: ThemeMode
}
