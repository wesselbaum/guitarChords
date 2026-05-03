type MainView = 'picked' | 'songs'

interface ViewTabsProps {
  activeView: MainView
  onChangeView: (view: MainView) => void
  pickedCount: number
  songsCount: number
}

export function ViewTabs({
  activeView,
  onChangeView,
  pickedCount,
  songsCount,
}: ViewTabsProps) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 px-4 print:hidden">
      <nav className="flex gap-4">
        <button
          onClick={() => onChangeView('picked')}
          aria-label="Picked chords tab"
          title="View picked chords"
          className={`py-3 text-sm font-medium border-b-2 transition-colors ${
            activeView === 'picked'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Picked Chords
          {pickedCount > 0 && (
            <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
              {pickedCount}
            </span>
          )}
        </button>
        <button
          onClick={() => onChangeView('songs')}
          aria-label="Saved songs tab"
          title="View saved songs"
          className={`py-3 text-sm font-medium border-b-2 transition-colors ${
            activeView === 'songs'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Saved Songs
          {songsCount > 0 && (
            <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
              {songsCount}
            </span>
          )}
        </button>
      </nav>
    </div>
  )
}
