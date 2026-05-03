import type { Song } from '../types/chord'

interface SongManagerProps {
  songs: Song[]
  onLoadSong: (song: Song) => void
  onDeleteSong: (id: string) => void
}

export function SongManager({
  songs,
  onLoadSong,
  onDeleteSong,
}: SongManagerProps) {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Saved Songs</h2>

      {songs.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center">
          No saved songs yet
        </p>
      ) : (
        <div className="space-y-2">
          {songs.map((song) => (
            <div
              key={song.id}
              className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <div>
                <span className="font-medium">{song.name}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                  {song.chordIds.length === 1
                    ? '1 chord'
                    : `${song.chordIds.length} chords`}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onLoadSong(song)}
                  aria-label={`Load ${song.name}`}
                  title={`Load chords from ${song.name}`}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Load
                </button>
                <button
                  onClick={() => onDeleteSong(song.id)}
                  aria-label={`Delete ${song.name}`}
                  title={`Delete ${song.name}`}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
