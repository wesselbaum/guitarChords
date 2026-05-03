import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SongView } from './SongView'
import type { Chord, Song } from '../types/chord'

const amChord: Chord = {
  id: 'am',
  name: 'Am',
  rootNote: 'A',
  category: 'minor',
  strings: [null, 0, 2, 2, 1, 0],
  fingers: [null, null, 2, 3, 1, null],
  startFret: 1,
  barres: [],
  isCustom: false,
}

const cChord: Chord = {
  id: 'c',
  name: 'C',
  rootNote: 'C',
  category: 'open',
  strings: [null, 3, 2, 0, 1, 0],
  fingers: [null, 3, 2, null, 1, null],
  startFret: 1,
  barres: [],
  isCustom: false,
}

const testSong: Song = {
  id: 'song-1',
  name: 'Test Song',
  chordIds: ['am', 'c'],
  createdAt: Date.now(),
}

const emptySong: Song = {
  id: 'song-2',
  name: 'Empty Song',
  chordIds: [],
  createdAt: Date.now(),
}

const defaultProps = {
  songs: [testSong, emptySong],
  allChords: [amChord, cChord],
  onSaveSong: vi.fn(),
  onDeleteSong: vi.fn(),
  onRemoveChordFromSong: vi.fn(),
  currentSong: null as Song | null,
  onSelectSong: vi.fn(),
  onNewSong: vi.fn(),
}

describe('SongView', () => {
  it('shows "Select or create a song" when no song selected', () => {
    render(<SongView {...defaultProps} currentSong={null} />)
    expect(screen.getByText(/select or create a song/i)).toBeInTheDocument()
  })

  it('shows song name in editable input when song selected', () => {
    render(<SongView {...defaultProps} currentSong={testSong} />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('Test Song')
  })

  it('renders chord diagrams for song chords', () => {
    render(<SongView {...defaultProps} currentSong={testSong} />)
    expect(screen.getByText('Am')).toBeInTheDocument()
    expect(screen.getByText('C')).toBeInTheDocument()
  })

  it('shows "No chords selected" when song has empty chordIds', () => {
    render(<SongView {...defaultProps} currentSong={emptySong} />)
    expect(screen.getByText(/no chords selected/i)).toBeInTheDocument()
  })

  it('calls onSaveSong when save button clicked', async () => {
    const onSaveSong = vi.fn()
    render(
      <SongView {...defaultProps} currentSong={testSong} onSaveSong={onSaveSong} />
    )
    await userEvent.click(screen.getByRole('button', { name: /save/i }))
    expect(onSaveSong).toHaveBeenCalledWith(testSong)
  })

  it('calls onDeleteSong when delete button clicked', async () => {
    const onDeleteSong = vi.fn()
    render(
      <SongView {...defaultProps} currentSong={testSong} onDeleteSong={onDeleteSong} />
    )
    await userEvent.click(screen.getByRole('button', { name: /delete/i }))
    expect(onDeleteSong).toHaveBeenCalledWith('song-1')
  })

  it('calls onNewSong when new song button clicked', async () => {
    const onNewSong = vi.fn()
    render(<SongView {...defaultProps} onNewSong={onNewSong} />)
    await userEvent.click(screen.getByRole('button', { name: /new song/i }))
    expect(onNewSong).toHaveBeenCalled()
  })
})
