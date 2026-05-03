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

  it('calls onPick when pick button is clicked', async () => {
    const onPick = vi.fn()
    render(<ChordCard chord={amChord} onPick={onPick} />)
    await userEvent.click(screen.getByRole('button', { name: /pick chord/i }))
    expect(onPick).toHaveBeenCalledWith('am')
  })

  it('calls onUnpick when unpick button is clicked', async () => {
    const onUnpick = vi.fn()
    render(<ChordCard chord={amChord} isPicked onUnpick={onUnpick} />)
    await userEvent.click(screen.getByRole('button', { name: /remove from picked/i }))
    expect(onUnpick).toHaveBeenCalledWith('am')
  })

  it('shows selected state when chord is picked', () => {
    const { container } = render(<ChordCard chord={amChord} isPicked />)
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

  it('pick button has title attribute', () => {
    render(<ChordCard chord={amChord} onPick={() => {}} />)
    expect(screen.getByRole('button', { name: /pick chord/i })).toHaveAttribute('title')
  })

  it('unpick button has title attribute', () => {
    render(<ChordCard chord={amChord} isPicked onUnpick={() => {}} />)
    expect(screen.getByRole('button', { name: /remove from picked/i })).toHaveAttribute('title')
  })

  it('use-as-template button has title attribute', () => {
    render(<ChordCard chord={amChord} onUseAsTemplate={() => {}} />)
    expect(screen.getByRole('button', { name: /template/i })).toHaveAttribute('title')
  })

  it('shows delete button for custom chords when onDeleteChord provided', () => {
    const customChord = { ...amChord, isCustom: true }
    render(<ChordCard chord={customChord} onDeleteChord={() => {}} />)
    expect(screen.getByRole('button', { name: /delete.*chord/i })).toBeInTheDocument()
  })

  it('does not show delete button for default chords', () => {
    render(<ChordCard chord={amChord} onDeleteChord={() => {}} />)
    expect(screen.queryByRole('button', { name: /delete.*chord/i })).not.toBeInTheDocument()
  })

  it('does not show delete button when onDeleteChord not provided', () => {
    const customChord = { ...amChord, isCustom: true }
    render(<ChordCard chord={customChord} />)
    expect(screen.queryByRole('button', { name: /delete.*chord/i })).not.toBeInTheDocument()
  })

  it('calls onDeleteChord with chord id when delete button clicked', async () => {
    const onDelete = vi.fn()
    const customChord = { ...amChord, id: 'custom-am', isCustom: true }
    render(<ChordCard chord={customChord} onDeleteChord={onDelete} />)
    await userEvent.click(screen.getByRole('button', { name: /delete.*chord/i }))
    expect(onDelete).toHaveBeenCalledWith('custom-am')
  })

  it('delete button has title attribute', () => {
    const customChord = { ...amChord, isCustom: true }
    render(<ChordCard chord={customChord} onDeleteChord={() => {}} />)
    expect(screen.getByRole('button', { name: /delete.*chord/i })).toHaveAttribute('title')
  })
})
