import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChordEditor } from './ChordEditor'
import type { Chord } from '../types/chord'

const mockChord: Chord = {
  id: 'test-am',
  name: 'Am',
  rootNote: 'A',
  category: 'minor',
  strings: [null, 0, 2, 2, 1, 0],
  fingers: [null, null, 2, 3, 1, null],
  startFret: 1,
  barres: [],
  isCustom: true,
}

describe('ChordEditor', () => {
  it('renders editor with empty fretboard when no initialChord', () => {
    render(<ChordEditor onSave={() => {}} onCancel={() => {}} />)
    expect(screen.getByLabelText(/name/i)).toHaveValue('')
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })

  it('renders editor with pre-filled data when initialChord provided', () => {
    render(
      <ChordEditor onSave={() => {}} onCancel={() => {}} initialChord={mockChord} />
    )
    expect(screen.getByLabelText(/name/i)).toHaveValue('Am')
  })

  it('calls onCancel when cancel button clicked', async () => {
    const handleCancel = vi.fn()
    render(<ChordEditor onSave={() => {}} onCancel={handleCancel} />)
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(handleCancel).toHaveBeenCalledOnce()
  })

  it('calls onSave with chord data when save button clicked', async () => {
    const handleSave = vi.fn()
    render(<ChordEditor onSave={handleSave} onCancel={() => {}} />)
    await userEvent.type(screen.getByLabelText(/name/i), 'G')
    await userEvent.click(screen.getByRole('button', { name: /save/i }))
    expect(handleSave).toHaveBeenCalledOnce()
    const savedChord = handleSave.mock.calls[0]![0] as Chord
    expect(savedChord.name).toBe('G')
    expect(savedChord.id).toBeTruthy()
    expect(savedChord.isCustom).toBe(true)
  })

  it('updates name field when user types', async () => {
    render(<ChordEditor onSave={() => {}} onCancel={() => {}} />)
    const input = screen.getByLabelText(/name/i)
    await userEvent.type(input, 'Cmaj7')
    expect(input).toHaveValue('Cmaj7')
  })

  it('shows SVG fretboard element', () => {
    const { container } = render(<ChordEditor onSave={() => {}} onCancel={() => {}} />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('changes finger number when clicking on a placed finger dot', async () => {
    const handleSave = vi.fn()
    render(
      <ChordEditor onSave={handleSave} onCancel={() => {}} initialChord={mockChord} />
    )
    // mockChord has finger 1 on string 4 (B string, index 4)
    // Clicking the finger button should cycle: 1 → 2
    const fingerButton = screen.getByTestId('finger-btn-4')
    expect(fingerButton).toHaveTextContent('1')
    await userEvent.click(fingerButton)
    expect(fingerButton).toHaveTextContent('2')
  })

  it('cycles finger number back to 1 after 4', async () => {
    const chordWithFinger4: Chord = {
      ...mockChord,
      strings: [null, 0, 2, 0, 0, 0],
      fingers: [null, null, 4, null, null, null],
    }
    render(
      <ChordEditor onSave={() => {}} onCancel={() => {}} initialChord={chordWithFinger4} />
    )
    const fingerButton = screen.getByTestId('finger-btn-2')
    expect(fingerButton).toHaveTextContent('4')
    await userEvent.click(fingerButton)
    expect(fingerButton).toHaveTextContent('1')
  })

  it('auto-detects barres when same finger is on same fret across multiple strings', async () => {
    const barreChord: Chord = {
      ...mockChord,
      name: 'F',
      strings: [1, 3, 3, 2, 1, 1],
      fingers: [1, 3, 4, 2, 1, 1],
      startFret: 1,
      barres: [],
    }
    const handleSave = vi.fn()
    render(
      <ChordEditor onSave={handleSave} onCancel={() => {}} initialChord={barreChord} />
    )
    await userEvent.click(screen.getByRole('button', { name: /save/i }))
    const savedChord = handleSave.mock.calls[0]![0] as Chord
    expect(savedChord.barres).toEqual([1])
  })

  it('does not add barres when each finger appears only once', async () => {
    const handleSave = vi.fn()
    render(
      <ChordEditor onSave={handleSave} onCancel={() => {}} initialChord={mockChord} />
    )
    await userEvent.click(screen.getByRole('button', { name: /save/i }))
    const savedChord = handleSave.mock.calls[0]![0] as Chord
    expect(savedChord.barres).toEqual([])
  })

  it('reuses finger number when clicking same fret on multiple strings', async () => {
    const handleSave = vi.fn()
    render(<ChordEditor onSave={handleSave} onCancel={() => {}} />)

    // Click fret 1 on strings 1, 2, 3 (fret index 0 in editor)
    await userEvent.click(screen.getByTestId('fret-1-0'))
    await userEvent.click(screen.getByTestId('fret-2-0'))
    await userEvent.click(screen.getByTestId('fret-3-0'))

    await userEvent.click(screen.getByRole('button', { name: /save/i }))
    const savedChord = handleSave.mock.calls[0]![0] as Chord

    // All three strings should have finger 1 since they share fret 1
    expect(savedChord.fingers[1]).toBe(1)
    expect(savedChord.fingers[2]).toBe(1)
    expect(savedChord.fingers[3]).toBe(1)
    expect(savedChord.barres).toEqual([1])
  })
})
