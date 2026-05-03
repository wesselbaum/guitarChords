import { useState } from 'react'
import type { Chord, RootNote, ChordCategory, StringFret, FingerNumber } from '../types/chord'
import { EditorFretboard } from './EditorFretboard'

interface ChordEditorProps {
  onSave: (chord: Chord) => void
  onCancel: () => void
  initialChord?: Chord
}

const ROOT_NOTES: RootNote[] = [
  'A', 'A#', 'Bb', 'B', 'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab',
]

const CATEGORIES: ChordCategory[] = [
  'open', 'barre', '7th', 'maj7', 'min7', 'sus', 'add', 'dim', 'aug', 'power', 'minor',
]

const EMPTY_STRINGS: [StringFret, StringFret, StringFret, StringFret, StringFret, StringFret] =
  [0, 0, 0, 0, 0, 0]
const EMPTY_FINGERS: [FingerNumber, FingerNumber, FingerNumber, FingerNumber, FingerNumber, FingerNumber] =
  [null, null, null, null, null, null]

export function ChordEditor({ onSave, onCancel, initialChord }: ChordEditorProps) {
  const [name, setName] = useState(initialChord?.name ?? '')
  const [longName, setLongName] = useState(initialChord?.longName ?? '')
  const [rootNote, setRootNote] = useState<RootNote>(initialChord?.rootNote ?? 'C')
  const [category, setCategory] = useState<ChordCategory>(initialChord?.category ?? 'open')
  const [startFret, setStartFret] = useState(initialChord?.startFret ?? 1)
  const [strings, setStrings] = useState(initialChord?.strings ?? [...EMPTY_STRINGS] as typeof EMPTY_STRINGS)
  const [fingers, setFingers] = useState(initialChord?.fingers ?? [...EMPTY_FINGERS] as typeof EMPTY_FINGERS)

  function handleFretClick(stringIndex: number, fret: number) {
    const newStrings = [...strings] as typeof strings
    const newFingers = [...fingers] as typeof fingers

    if (newStrings[stringIndex] === fret) {
      newStrings[stringIndex] = 0
      newFingers[stringIndex] = null
    } else {
      newStrings[stringIndex] = fret
      const existingFinger = newFingers.find(
        (f, i) => f !== null && newStrings[i] === fret && i !== stringIndex
      )
      if (existingFinger != null) {
        newFingers[stringIndex] = existingFinger
      } else {
        const usedFingers = new Set(newFingers.filter((f): f is 1 | 2 | 3 | 4 => f !== null))
        const nextFinger = ([1, 2, 3, 4] as const).find((f) => !usedFingers.has(f)) ?? null
        newFingers[stringIndex] = nextFinger
      }
    }
    setStrings(newStrings)
    setFingers(newFingers)
  }

  function handleFingerClick(stringIndex: number) {
    const newFingers = [...fingers] as typeof fingers
    const current = newFingers[stringIndex]
    if (current === null || current === undefined) return
    const next: 1 | 2 | 3 | 4 = current >= 4 ? 1 : ((current + 1) as 1 | 2 | 3 | 4)
    newFingers[stringIndex] = next
    setFingers(newFingers)
  }

  function handleStringToggle(stringIndex: number) {
    const newStrings = [...strings] as typeof strings
    const newFingers = [...fingers] as typeof fingers
    if (newStrings[stringIndex] === null) {
      newStrings[stringIndex] = 0
      newFingers[stringIndex] = null
    } else {
      newStrings[stringIndex] = null
      newFingers[stringIndex] = null
    }
    setStrings(newStrings)
    setFingers(newFingers)
  }

  function detectBarres(): number[] {
    const fingerFretCounts = new Map<string, number>()
    strings.forEach((fret, i) => {
      const finger = fingers[i]
      if (fret === null || fret === 0 || finger === null) return
      const key = `${finger}-${fret}`
      fingerFretCounts.set(key, (fingerFretCounts.get(key) ?? 0) + 1)
    })
    const barres = new Set<number>()
    for (const [key, count] of fingerFretCounts) {
      if (count >= 2) {
        barres.add(Number(key.split('-')[1]))
      }
    }
    return [...barres].sort((a, b) => a - b)
  }

  function handleSave() {
    const chord: Chord = {
      id: crypto.randomUUID(),
      name,
      longName: longName || undefined,
      rootNote,
      category,
      strings,
      fingers,
      startFret,
      barres: detectBarres(),
      isCustom: true,
    }
    onSave(chord)
  }

  return (
    <div className="flex flex-col gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="flex gap-4">
        <div className="flex flex-col gap-1 flex-1">
          <label htmlFor="chord-name" className="text-sm font-medium dark:text-gray-200">Chord Name</label>
          <input id="chord-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
            className="border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600" placeholder="e.g. Am7" />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label htmlFor="long-name" className="text-sm font-medium dark:text-gray-200">Long Name</label>
          <input id="long-name" type="text" value={longName} onChange={(e) => setLongName(e.target.value)}
            className="border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600" placeholder="e.g. A Minor 7th" />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="root-note" className="text-sm font-medium dark:text-gray-200">Root Note</label>
          <select
            id="root-note"
            value={rootNote}
            onChange={(e) => setRootNote(e.target.value as RootNote)}
            className="border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-100"
          >
            {ROOT_NOTES.map((note) => <option key={note} value={note}>{note}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="category" className="text-sm font-medium dark:text-gray-200">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as ChordCategory)}
            className="border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-100"
          >
            {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="start-fret" className="text-sm font-medium dark:text-gray-200">Start Fret</label>
          <input
            id="start-fret"
            type="number"
            min={1}
            max={12}
            value={startFret}
            onChange={(e) => setStartFret(Number(e.target.value))}
            className="border rounded px-2 py-1 w-16 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
      </div>

      <EditorFretboard
        strings={strings}
        fingers={fingers}
        startFret={startFret}
        onFretClick={handleFretClick}
        onStringToggle={handleStringToggle}
        onFingerClick={handleFingerClick}
      />

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          title="Cancel editing"
          className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          title="Save chord"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  )
}
