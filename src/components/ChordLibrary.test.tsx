import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChordLibrary } from './ChordLibrary'
import type { Chord } from '../types/chord'

const chords: Chord[] = [
  {
    id: 'am',
    name: 'Am',
    rootNote: 'A',
    category: 'minor',
    strings: [null, 0, 2, 2, 1, 0],
    fingers: [null, null, 2, 3, 1, null],
    startFret: 1,
    barres: [],
    isCustom: false,
  },
  {
    id: 'c-major',
    name: 'C',
    rootNote: 'C',
    category: 'open',
    strings: [null, 3, 2, 0, 1, 0],
    fingers: [null, 3, 2, null, 1, null],
    startFret: 1,
    barres: [],
    isCustom: false,
  },
  {
    id: 'g-major',
    name: 'G',
    rootNote: 'G',
    category: 'open',
    strings: [3, 2, 0, 0, 0, 3],
    fingers: [2, 1, null, null, null, 3],
    startFret: 1,
    barres: [],
    isCustom: false,
  },
]

function getChordGrid() {
  return screen.getByTestId('chord-grid')
}

describe('ChordLibrary', () => {
  it('renders all chords in the grid', () => {
    render(
      <ChordLibrary
        chords={chords}
        songChordIds={[]}
        onAddToSong={() => {}}
        onRemoveFromSong={() => {}}
        onUseAsTemplate={() => {}}
        onNewChord={() => {}}
      />
    )
    const grid = getChordGrid()
    expect(within(grid).getByText('Am')).toBeInTheDocument()
    expect(within(grid).getByText('C')).toBeInTheDocument()
    expect(within(grid).getByText('G')).toBeInTheDocument()
  })

  it('filters chords by search text', async () => {
    render(
      <ChordLibrary
        chords={chords}
        songChordIds={[]}
        onAddToSong={() => {}}
        onRemoveFromSong={() => {}}
        onUseAsTemplate={() => {}}
        onNewChord={() => {}}
      />
    )
    await userEvent.type(screen.getByPlaceholderText(/search/i), 'Am')
    const grid = getChordGrid()
    expect(within(grid).getByText('Am')).toBeInTheDocument()
    expect(within(grid).queryByText('G')).not.toBeInTheDocument()
  })

  it('filters chords by root note', async () => {
    render(
      <ChordLibrary
        chords={chords}
        songChordIds={[]}
        onAddToSong={() => {}}
        onRemoveFromSong={() => {}}
        onUseAsTemplate={() => {}}
        onNewChord={() => {}}
      />
    )
    await userEvent.click(screen.getByRole('button', { name: 'A' }))
    const grid = getChordGrid()
    expect(within(grid).getByText('Am')).toBeInTheDocument()
    expect(within(grid).queryByText('C')).not.toBeInTheDocument()
    expect(within(grid).queryByText('G')).not.toBeInTheDocument()
  })

  it('clears root note filter when same note is clicked again', async () => {
    render(
      <ChordLibrary
        chords={chords}
        songChordIds={[]}
        onAddToSong={() => {}}
        onRemoveFromSong={() => {}}
        onUseAsTemplate={() => {}}
        onNewChord={() => {}}
      />
    )
    await userEvent.click(screen.getByRole('button', { name: 'A' }))
    await userEvent.click(screen.getByRole('button', { name: 'A' }))
    const grid = getChordGrid()
    expect(within(grid).getByText('Am')).toBeInTheDocument()
    expect(within(grid).getByText('C')).toBeInTheDocument()
    expect(within(grid).getByText('G')).toBeInTheDocument()
  })

  it('calls onNewChord when new chord button is clicked', async () => {
    const onNew = vi.fn()
    render(
      <ChordLibrary
        chords={chords}
        songChordIds={[]}
        onAddToSong={() => {}}
        onRemoveFromSong={() => {}}
        onUseAsTemplate={() => {}}
        onNewChord={onNew}
      />
    )
    await userEvent.click(screen.getByRole('button', { name: /new chord/i }))
    expect(onNew).toHaveBeenCalledOnce()
  })

  it('marks chords that are in current song', () => {
    render(
      <ChordLibrary
        chords={chords}
        songChordIds={['am']}
        onAddToSong={() => {}}
        onRemoveFromSong={() => {}}
        onUseAsTemplate={() => {}}
        onNewChord={() => {}}
      />
    )
    const grid = getChordGrid()
    const amCard = within(grid).getByText('Am').closest('[class*="ring-2"]')
    expect(amCard).toBeInTheDocument()
  })

  it('root note filter buttons have title attributes', () => {
    render(
      <ChordLibrary
        chords={chords}
        songChordIds={[]}
        onAddToSong={() => {}}
        onRemoveFromSong={() => {}}
        onUseAsTemplate={() => {}}
        onNewChord={() => {}}
      />
    )
    const noteButton = screen.getByRole('button', { name: 'A' })
    expect(noteButton).toHaveAttribute('title')
  })

  it('new chord button has title attribute', () => {
    render(
      <ChordLibrary
        chords={chords}
        songChordIds={[]}
        onAddToSong={() => {}}
        onRemoveFromSong={() => {}}
        onUseAsTemplate={() => {}}
        onNewChord={() => {}}
      />
    )
    expect(screen.getByRole('button', { name: /new chord/i })).toHaveAttribute('title')
  })
})
