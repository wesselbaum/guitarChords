import type { Chord, Song } from '../types/chord'
import { ChordDiagram } from './ChordDiagram'

interface SongViewProps {
  songs: Song[]
  allChords: Chord[]
  onSaveSong: (song: Song) => void
  onDeleteSong: (id: string) => void
  onRemoveChordFromSong: (chordId: string) => void
  currentSong: Song | null
  onSelectSong: (song: Song | null) => void
  onNewSong: () => void
}

export function SongView({
  songs,
  allChords,
  onSaveSong,
  onDeleteSong,
  onRemoveChordFromSong,
  currentSong,
  onSelectSong,
  onNewSong,
}: SongViewProps) {
  if (!currentSong) {
    return (
      <div className="p-4">
        <div className="flex gap-2 mb-4">
          <select
            className="flex-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
            value=""
            onChange={(e) => {
              const song = songs.find((s) => s.id === e.target.value)
              onSelectSong(song ?? null)
            }}
          >
            <option value="">Select a song...</option>
            {songs.map((song) => (
              <option key={song.id} value={song.id}>
                {song.name}
              </option>
            ))}
          </select>
          <button
            onClick={onNewSong}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            New Song
          </button>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Select or create a song
        </p>
      </div>
    )
  }

  const songChords = currentSong.chordIds
    .map((id) => allChords.find((c) => c.id === id))
    .filter((c): c is Chord => c !== undefined)

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <select
          className="flex-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
          value={currentSong.id}
          onChange={(e) => {
            if (e.target.value === '') {
              onSelectSong(null)
              return
            }
            const song = songs.find((s) => s.id === e.target.value)
            onSelectSong(song ?? null)
          }}
        >
          <option value="">Select a song...</option>
          {songs.map((song) => (
            <option key={song.id} value={song.id}>
              {song.name}
            </option>
          ))}
        </select>
        <button
          onClick={onNewSong}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          New Song
        </button>
      </div>

      <div className="flex gap-2 mb-4 items-center">
        <input
          type="text"
          value={currentSong.name}
          onChange={() => {}}
          className="flex-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
        />
        <button
          onClick={() => onSaveSong(currentSong)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save
        </button>
        <button
          onClick={() => onDeleteSong(currentSong.id)}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Print
        </button>
      </div>

      {songChords.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center">
          No chords selected
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {songChords.map((chord, index) => (
            <div key={`${chord.id}-${index}`} className="relative group">
              <ChordDiagram chord={chord} size="md" />
              <button
                onClick={() => onRemoveChordFromSong(chord.id)}
                aria-label={`Remove ${chord.name}`}
                className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity text-xs px-1.5 py-0.5 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
