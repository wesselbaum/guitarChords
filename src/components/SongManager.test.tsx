import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SongManager } from './SongManager'
import type { Song } from '../types/chord'

const testSong: Song = {
  id: 'song-1',
  name: 'Test Song',
  chordIds: ['am', 'c'],
  createdAt: Date.now(),
}

const anotherSong: Song = {
  id: 'song-2',
  name: 'Another Song',
  chordIds: ['g'],
  createdAt: Date.now(),
}

const defaultProps = {
  songs: [testSong, anotherSong],
  onLoadSong: vi.fn(),
  onDeleteSong: vi.fn(),
}

describe('SongManager', () => {
  it('renders song list heading', () => {
    render(<SongManager {...defaultProps} />)
    expect(screen.getByText(/saved songs/i)).toBeInTheDocument()
  })

  it('shows message when no songs saved', () => {
    render(<SongManager {...defaultProps} songs={[]} />)
    expect(screen.getByText(/no saved songs/i)).toBeInTheDocument()
  })

  it('renders all saved song names', () => {
    render(<SongManager {...defaultProps} />)
    expect(screen.getByText('Test Song')).toBeInTheDocument()
    expect(screen.getByText('Another Song')).toBeInTheDocument()
  })

  it('calls onLoadSong with song when load button clicked', async () => {
    const onLoadSong = vi.fn()
    render(<SongManager {...defaultProps} onLoadSong={onLoadSong} />)
    const loadButtons = screen.getAllByRole('button', { name: /load/i })
    await userEvent.click(loadButtons[0] as HTMLElement)
    expect(onLoadSong).toHaveBeenCalledWith(testSong)
  })

  it('calls onDeleteSong with song id when delete button clicked', async () => {
    const onDeleteSong = vi.fn()
    render(<SongManager {...defaultProps} onDeleteSong={onDeleteSong} />)
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await userEvent.click(deleteButtons[0] as HTMLElement)
    expect(onDeleteSong).toHaveBeenCalledWith('song-1')
  })

  it('load buttons have title attributes', () => {
    render(<SongManager {...defaultProps} />)
    const loadButtons = screen.getAllByRole('button', { name: /load/i })
    loadButtons.forEach((btn) => {
      expect(btn).toHaveAttribute('title')
    })
  })

  it('delete buttons have title attributes', () => {
    render(<SongManager {...defaultProps} />)
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    deleteButtons.forEach((btn) => {
      expect(btn).toHaveAttribute('title')
    })
  })

  it('shows chord count for each song', () => {
    render(<SongManager {...defaultProps} />)
    expect(screen.getByText(/2 chords/i)).toBeInTheDocument()
    expect(screen.getByText(/1 chord(?!s)/i)).toBeInTheDocument()
  })
})
