import { useState, useMemo, useCallback } from 'react'
import type { Chord, Song } from './types/chord'
import { defaultChords } from './data/defaultChords'
import { useAppStore } from './hooks/useAppStore'
import { useTheme } from './hooks/useTheme'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { ChordLibrary } from './components/ChordLibrary'
import { SongView } from './components/SongView'
import { ChordEditor } from './components/ChordEditor'
import { ThemeToggle } from './components/ThemeToggle'
import { ExportImport } from './components/ExportImport'
import { FingerLegend } from './components/FingerLegend'

type MainView = 'song' | 'editor'
const THEME_CYCLE = { light: 'dark', dark: 'system', system: 'light' } as const

function App() {
  const { theme, setTheme } = useTheme()
  const store = useAppStore()
  const [mainView, setMainView] = useState<MainView>('song')
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [editorChord, setEditorChord] = useState<Chord | undefined>(undefined)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const allChords = useMemo(() => {
    const visible = defaultChords.filter(
      (c) => !store.hiddenDefaultChordIds.includes(c.id)
    )
    return [...visible, ...store.customChords]
  }, [store.customChords, store.hiddenDefaultChordIds])

  const songChordIds = currentSong?.chordIds ?? []

  const handleAddToSong = useCallback((chordId: string) => {
    setCurrentSong((prev) => {
      if (!prev) return prev
      if (prev.chordIds.includes(chordId)) return prev
      return { ...prev, chordIds: [...prev.chordIds, chordId] }
    })
  }, [])

  const handleRemoveFromSong = useCallback((chordId: string) => {
    setCurrentSong((prev) => {
      if (!prev) return prev
      return { ...prev, chordIds: prev.chordIds.filter((id) => id !== chordId) }
    })
  }, [])

  const handleNewSong = useCallback(() => {
    const song: Song = {
      id: crypto.randomUUID(),
      name: 'New Song',
      chordIds: [],
      createdAt: Date.now(),
    }
    setCurrentSong(song)
    setMainView('song')
  }, [])

  const handleSaveSong = useCallback((song: Song) => {
    const existing = store.songs.find((s) => s.id === song.id)
    if (existing) {
      store.updateSong(song)
    } else {
      store.addSong(song)
    }
  }, [store])

  const handleNewChord = useCallback(() => {
    setEditorChord(undefined)
    setMainView('editor')
  }, [])

  const handleUseAsTemplate = useCallback((chord: Chord) => {
    setEditorChord(chord)
    setMainView('editor')
  }, [])

  const handleSaveChord = useCallback((chord: Chord) => {
    store.addCustomChord(chord)
    setMainView('song')
  }, [store])

  const handleCancelEditor = useCallback(() => {
    setMainView('song')
  }, [])

  const handleThemeToggle = useCallback(() => {
    setTheme(THEME_CYCLE[theme])
  }, [theme, setTheme])

  const handleFocusSearch = useCallback(() => {
    const input = document.querySelector<HTMLInputElement>('input[placeholder*="Search"]')
    input?.focus()
  }, [])

  useKeyboardShortcuts({
    '/': handleFocusSearch,
    'escape': handleCancelEditor,
    'ctrl+e': handleNewChord,
    'ctrl+p': () => window.print(),
    'ctrl+shift+d': handleThemeToggle,
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="lg:hidden p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">Guitar Chord Reference</h1>
        </div>
        <div className="flex items-center gap-3">
          <ExportImport
            onExport={store.exportData}
            onImport={store.importData}
          />
          <ThemeToggle theme={theme} onToggle={handleThemeToggle} />
        </div>
      </header>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            fixed lg:static lg:translate-x-0
            z-20 w-72 h-[calc(100vh-57px)]
            border-r border-gray-200 dark:border-gray-700
            bg-white dark:bg-gray-800
            overflow-hidden flex flex-col
            transition-transform duration-200 ease-in-out
            print:hidden
          `}
        >
          <ChordLibrary
            chords={allChords}
            songChordIds={songChordIds}
            onAddToSong={handleAddToSong}
            onRemoveFromSong={handleRemoveFromSong}
            onUseAsTemplate={handleUseAsTemplate}
            onNewChord={handleNewChord}
          />
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-10 bg-black/30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {mainView === 'song' ? (
            <SongView
              songs={store.songs}
              allChords={allChords}
              onSaveSong={handleSaveSong}
              onDeleteSong={store.removeSong}
              onRemoveChordFromSong={handleRemoveFromSong}
              currentSong={currentSong}
              onSelectSong={setCurrentSong}
              onNewSong={handleNewSong}
            />
          ) : (
            <div className="p-4 max-w-2xl mx-auto">
              <ChordEditor
                onSave={handleSaveChord}
                onCancel={handleCancelEditor}
                initialChord={editorChord}
              />
            </div>
          )}
        </main>
      </div>

      {/* Finger color legend — bottom right */}
      <div className="fixed bottom-4 right-4 z-10 opacity-80 hover:opacity-100 transition-opacity print:hidden">
        <FingerLegend />
      </div>
    </div>
  )
}

export default App
