import type { Chord } from '../types/chord'
import { ChordDiagram } from './ChordDiagram'

interface PickedChordsViewProps {
  pickedChords: Chord[]
  onRemoveChord: (chordId: string) => void
  onClearAll: () => void
  onSaveAsSong: () => void
}

export function PickedChordsView({
  pickedChords,
  onRemoveChord,
  onClearAll,
  onSaveAsSong,
}: PickedChordsViewProps) {
  if (pickedChords.length === 0) {
    return (
      <div className="p-4">
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Pick chords from the library to get started
        </p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4 items-center justify-between">
        <h2 className="text-lg font-semibold">
          Picked Chords ({pickedChords.length})
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onClearAll}
            aria-label="Clear all"
            title="Remove all picked chords"
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Clear All
          </button>
          <button
            onClick={onSaveAsSong}
            aria-label="Save as song"
            title="Save picked chords as a new song"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save as Song
          </button>
        </div>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 250px), 1fr))' }}>
        {pickedChords.map((chord, index) => (
          <div key={`${chord.id}-${index}`} className="relative group p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
            <ChordDiagram chord={chord} responsive />
            <button
              onClick={() => onRemoveChord(chord.id)}
              aria-label={`Remove ${chord.name}`}
              title={`Remove ${chord.name} from picked chords`}
              className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity text-xs px-1.5 py-0.5 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
