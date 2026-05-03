import { useState, useCallback } from 'react'
import type { Chord, Song, AppData } from '../types/chord'

const STORAGE_KEY = 'guitar-chords-data'

function getDefaultAppData(): AppData {
  return {
    customChords: [],
    songs: [],
    hiddenDefaultChordIds: [],
    theme: 'system',
  }
}

function loadFromStorage(): AppData {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return getDefaultAppData()
  try {
    return JSON.parse(stored) as AppData
  } catch {
    return getDefaultAppData()
  }
}

function saveToStorage(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function useAppStore() {
  const [data, setData] = useState<AppData>(loadFromStorage)

  const persist = useCallback((updater: (prev: AppData) => AppData) => {
    setData((prev) => {
      const next = updater(prev)
      saveToStorage(next)
      return next
    })
  }, [])

  const addCustomChord = useCallback((chord: Chord) => {
    persist((prev) => ({
      ...prev,
      customChords: [...prev.customChords, chord],
    }))
  }, [persist])

  const removeCustomChord = useCallback((id: string) => {
    persist((prev) => ({
      ...prev,
      customChords: prev.customChords.filter((c) => c.id !== id),
    }))
  }, [persist])

  const updateCustomChord = useCallback((chord: Chord) => {
    persist((prev) => ({
      ...prev,
      customChords: prev.customChords.map((c) =>
        c.id === chord.id ? chord : c
      ),
    }))
  }, [persist])

  const addSong = useCallback((song: Song) => {
    persist((prev) => ({
      ...prev,
      songs: [...prev.songs, song],
    }))
  }, [persist])

  const removeSong = useCallback((id: string) => {
    persist((prev) => ({
      ...prev,
      songs: prev.songs.filter((s) => s.id !== id),
    }))
  }, [persist])

  const updateSong = useCallback((song: Song) => {
    persist((prev) => ({
      ...prev,
      songs: prev.songs.map((s) => (s.id === song.id ? song : s)),
    }))
  }, [persist])

  const hideDefaultChord = useCallback((id: string) => {
    persist((prev) => ({
      ...prev,
      hiddenDefaultChordIds: [...prev.hiddenDefaultChordIds, id],
    }))
  }, [persist])

  const unhideDefaultChord = useCallback((id: string) => {
    persist((prev) => ({
      ...prev,
      hiddenDefaultChordIds: prev.hiddenDefaultChordIds.filter(
        (hid) => hid !== id
      ),
    }))
  }, [persist])

  const exportData = useCallback((): string => {
    return JSON.stringify(data)
  }, [data])

  const importData = useCallback((jsonString: string) => {
    try {
      const imported = JSON.parse(jsonString) as AppData
      persist(() => imported)
    } catch {
      // Invalid JSON — ignore
    }
  }, [persist])

  return {
    customChords: data.customChords,
    songs: data.songs,
    hiddenDefaultChordIds: data.hiddenDefaultChordIds,
    addCustomChord,
    removeCustomChord,
    updateCustomChord,
    addSong,
    removeSong,
    updateSong,
    hideDefaultChord,
    unhideDefaultChord,
    exportData,
    importData,
  }
}
