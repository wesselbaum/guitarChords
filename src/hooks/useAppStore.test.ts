import { renderHook, act } from '@testing-library/react'
import { useAppStore } from './useAppStore'
import type { Chord, Song } from '../types/chord'

const testChord: Chord = {
  id: 'test-chord',
  name: 'Test',
  rootNote: 'C',
  category: 'open',
  strings: [0, 3, 2, 0, 1, 0],
  fingers: [null, 3, 2, null, 1, null],
  startFret: 1,
  barres: [],
  isCustom: true,
}

describe('useAppStore', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('custom chords', () => {
    it('starts with no custom chords', () => {
      const { result } = renderHook(() => useAppStore())
      expect(result.current.customChords).toEqual([])
    })

    it('adds a custom chord', () => {
      const { result } = renderHook(() => useAppStore())
      act(() => {
        result.current.addCustomChord(testChord)
      })
      expect(result.current.customChords).toHaveLength(1)
      expect(result.current.customChords[0]?.name).toBe('Test')
    })

    it('removes a custom chord', () => {
      const { result } = renderHook(() => useAppStore())
      act(() => {
        result.current.addCustomChord(testChord)
      })
      act(() => {
        result.current.removeCustomChord('test-chord')
      })
      expect(result.current.customChords).toHaveLength(0)
    })

    it('updates a custom chord', () => {
      const { result } = renderHook(() => useAppStore())
      act(() => {
        result.current.addCustomChord(testChord)
      })
      act(() => {
        result.current.updateCustomChord({ ...testChord, name: 'Updated' })
      })
      expect(result.current.customChords[0]?.name).toBe('Updated')
    })

    it('persists custom chords to localStorage', () => {
      const { result } = renderHook(() => useAppStore())
      act(() => {
        result.current.addCustomChord(testChord)
      })
      const stored = localStorage.getItem('guitar-chords-data')
      expect(stored).toBeTruthy()
      const parsed = JSON.parse(stored!) as { customChords: Chord[] }
      expect(parsed.customChords).toHaveLength(1)
    })
  })

  describe('songs', () => {
    it('starts with no songs', () => {
      const { result } = renderHook(() => useAppStore())
      expect(result.current.songs).toEqual([])
    })

    it('adds a song', () => {
      const { result } = renderHook(() => useAppStore())
      const song: Song = {
        id: 'song-1',
        name: 'Test Song',
        chordIds: ['am', 'c-major'],
        createdAt: Date.now(),
      }
      act(() => {
        result.current.addSong(song)
      })
      expect(result.current.songs).toHaveLength(1)
      expect(result.current.songs[0]?.name).toBe('Test Song')
    })

    it('removes a song', () => {
      const { result } = renderHook(() => useAppStore())
      const song: Song = {
        id: 'song-1',
        name: 'Test Song',
        chordIds: [],
        createdAt: Date.now(),
      }
      act(() => {
        result.current.addSong(song)
      })
      act(() => {
        result.current.removeSong('song-1')
      })
      expect(result.current.songs).toHaveLength(0)
    })

    it('updates a song', () => {
      const { result } = renderHook(() => useAppStore())
      const song: Song = {
        id: 'song-1',
        name: 'Test Song',
        chordIds: [],
        createdAt: Date.now(),
      }
      act(() => {
        result.current.addSong(song)
      })
      act(() => {
        result.current.updateSong({ ...song, name: 'Renamed' })
      })
      expect(result.current.songs[0]?.name).toBe('Renamed')
    })
  })

  describe('hidden chords', () => {
    it('starts with no hidden chords', () => {
      const { result } = renderHook(() => useAppStore())
      expect(result.current.hiddenDefaultChordIds).toEqual([])
    })

    it('hides a default chord', () => {
      const { result } = renderHook(() => useAppStore())
      act(() => {
        result.current.hideDefaultChord('c-major')
      })
      expect(result.current.hiddenDefaultChordIds).toContain('c-major')
    })

    it('unhides a default chord', () => {
      const { result } = renderHook(() => useAppStore())
      act(() => {
        result.current.hideDefaultChord('c-major')
      })
      act(() => {
        result.current.unhideDefaultChord('c-major')
      })
      expect(result.current.hiddenDefaultChordIds).not.toContain('c-major')
    })
  })

  describe('export/import', () => {
    it('exports all data as JSON string', () => {
      const { result } = renderHook(() => useAppStore())
      act(() => {
        result.current.addCustomChord(testChord)
      })
      const exported = result.current.exportData()
      const parsed = JSON.parse(exported) as { customChords: Chord[] }
      expect(parsed.customChords).toHaveLength(1)
    })

    it('imports data from JSON string', () => {
      const { result } = renderHook(() => useAppStore())
      const data = JSON.stringify({
        customChords: [testChord],
        songs: [],
        hiddenDefaultChordIds: ['am'],
        theme: 'dark',
      })
      act(() => {
        result.current.importData(data)
      })
      expect(result.current.customChords).toHaveLength(1)
      expect(result.current.hiddenDefaultChordIds).toContain('am')
    })
  })
})
