import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChordCard } from './ChordCard'
import type { Chord } from '../types/chord'

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

describe('ChordCard', () => {
  it('renders chord name', () => {
    render(<ChordCard chord={amChord} />)
    expect(screen.getByText('Am')).toBeInTheDocument()
  })

  it('renders chord diagram', () => {
    const { container } = render(<ChordCard chord={amChord} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('calls onAddToSong when add button is clicked', async () => {
    const onAdd = vi.fn()
    render(<ChordCard chord={amChord} onAddToSong={onAdd} />)
    await userEvent.click(screen.getByRole('button', { name: /add.*song/i }))
    expect(onAdd).toHaveBeenCalledWith('am')
  })

  it('calls onRemoveFromSong when remove button is clicked', async () => {
    const onRemove = vi.fn()
    render(<ChordCard chord={amChord} isInSong onRemoveFromSong={onRemove} />)
    await userEvent.click(screen.getByRole('button', { name: /remove.*song/i }))
    expect(onRemove).toHaveBeenCalledWith('am')
  })

  it('shows selected state when chord is in song', () => {
    const { container } = render(<ChordCard chord={amChord} isInSong />)
    expect(container.firstChild).toHaveClass('ring-2')
  })

  it('calls onUseAsTemplate when template button is clicked', async () => {
    const onTemplate = vi.fn()
    render(<ChordCard chord={amChord} onUseAsTemplate={onTemplate} />)
    await userEvent.click(screen.getByRole('button', { name: /template/i }))
    expect(onTemplate).toHaveBeenCalledWith(amChord)
  })

  it('shows custom badge for custom chords', () => {
    const customChord = { ...amChord, isCustom: true }
    render(<ChordCard chord={customChord} />)
    expect(screen.getByText('Custom')).toBeInTheDocument()
  })

  it('does not show custom badge for default chords', () => {
    render(<ChordCard chord={amChord} />)
    expect(screen.queryByText('Custom')).not.toBeInTheDocument()
  })
})
