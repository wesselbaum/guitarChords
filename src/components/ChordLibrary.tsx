import { useState, useMemo } from 'react'
import type { Chord } from '../types/chord'
import { ChordCard } from './ChordCard'

const ROOT_NOTES = ['A', 'B', 'C', 'D', 'E', 'F', 'G'] as const

interface ChordLibraryProps {
  chords: Chord[]
  songChordIds: string[]
  onAddToSong: (id: string) => void
  onRemoveFromSong: (id: string) => void
  onUseAsTemplate: (chord: Chord) => void
  onNewChord: () => void
}

export function ChordLibrary({
  chords,
  songChordIds,
  onAddToSong,
  onRemoveFromSong,
  onUseAsTemplate,
  onNewChord,
}: ChordLibraryProps) {
  const [search, setSearch] = useState('')
  const [rootFilter, setRootFilter] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return chords.filter((chord) => {
      const matchesSearch = chord.name
        .toLowerCase()
        .includes(search.toLowerCase())
      const matchesRoot = rootFilter
        ? chord.rootNote.startsWith(rootFilter)
        : true
      return matchesSearch && matchesRoot
    })
  }, [chords, search, rootFilter])

  const handleRootClick = (note: string) => {
    setRootFilter((prev) => (prev === note ? null : note))
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <input
          type="text"
          placeholder="Search chords..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex flex-wrap gap-1 mt-2">
          {ROOT_NOTES.map((note) => (
            <button
              key={note}
              onClick={() => handleRootClick(note)}
              aria-label={note}
              title={`Filter by root note ${note}`}
              className={`px-2 py-0.5 text-xs rounded font-medium transition-colors ${
                rootFilter === note
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {note}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div data-testid="chord-grid" className="grid grid-cols-2 gap-2">
          {filtered.map((chord) => (
            <ChordCard
              key={chord.id}
              chord={chord}
              isInSong={songChordIds.includes(chord.id)}
              onAddToSong={onAddToSong}
              onRemoveFromSong={onRemoveFromSong}
              onUseAsTemplate={onUseAsTemplate}
            />
          ))}
        </div>
      </div>

      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onNewChord}
          aria-label="New chord"
          title="Create a new custom chord"
          className="w-full py-2 text-sm font-medium rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          + New Chord
        </button>
      </div>
    </div>
  )
}
