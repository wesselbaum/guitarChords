import type { Chord } from '../types/chord'
import { ChordDiagram } from './ChordDiagram'

interface ChordCardProps {
  chord: Chord
  isPicked?: boolean
  onPick?: (id: string) => void
  onUnpick?: (id: string) => void
  onUseAsTemplate?: (chord: Chord) => void
  onDeleteChord?: (id: string) => void
}

export function ChordCard({
  chord,
  isPicked = false,
  onPick,
  onUnpick,
  onUseAsTemplate,
  onDeleteChord,
}: ChordCardProps) {
  return (
    <div
      className={`relative p-2 rounded-lg border transition-all ${
        isPicked
          ? 'ring-2 ring-blue-500 border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
    >
      {chord.isCustom && (
        <span className="absolute top-1 right-1 text-xs px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded">
          Custom
        </span>
      )}

      <ChordDiagram chord={chord} size="sm" />

      <div className="flex gap-1 mt-1 justify-center">
        {isPicked && onUnpick ? (
          <button
            onClick={() => onUnpick(chord.id)}
            aria-label="Remove from picked"
            title="Remove from picked"
            className="text-xs px-2 py-0.5 rounded bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800"
          >
            -
          </button>
        ) : onPick ? (
          <button
            onClick={() => onPick(chord.id)}
            aria-label="Pick chord"
            title="Pick chord"
            className="text-xs px-2 py-0.5 rounded bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800"
          >
            +
          </button>
        ) : null}

        {onUseAsTemplate && (
          <button
            onClick={() => onUseAsTemplate(chord)}
            aria-label="Use as template"
            title="Use as template"
            className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            ⎘
          </button>
        )}

        {chord.isCustom && onDeleteChord && (
          <button
            onClick={() => onDeleteChord(chord.id)}
            aria-label="Delete chord"
            title="Delete chord"
            className="text-xs px-2 py-0.5 rounded bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
