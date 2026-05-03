import { render, screen } from '@testing-library/react'
import { ChordDiagram } from './ChordDiagram'
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

describe('ChordDiagram', () => {
  it('renders chord name', () => {
    render(<ChordDiagram chord={amChord} />)
    expect(screen.getByText('Am')).toBeInTheDocument()
  })

  it('renders long name below short name when provided', () => {
    const chordWithLongName: Chord = {
      ...amChord,
      longName: 'A Minor',
    }
    render(<ChordDiagram chord={chordWithLongName} />)
    expect(screen.getByText('A Minor')).toBeInTheDocument()
  })

  it('does not render long name when not provided', () => {
    render(<ChordDiagram chord={amChord} />)
    expect(screen.queryByText('A Minor')).not.toBeInTheDocument()
  })

  it('renders an SVG element', () => {
    const { container } = render(<ChordDiagram chord={amChord} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders muted string markers', () => {
    render(<ChordDiagram chord={amChord} />)
    const mutedMarkers = screen.getAllByText('X')
    expect(mutedMarkers.length).toBeGreaterThanOrEqual(1)
  })

  it('renders open string markers', () => {
    render(<ChordDiagram chord={amChord} />)
    const openMarkers = screen.getAllByText('O')
    expect(openMarkers.length).toBeGreaterThanOrEqual(1)
  })

  it('renders finger numbers on fretted strings', () => {
    render(<ChordDiagram chord={amChord} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('renders start fret indicator for higher positions', () => {
    const barreChord: Chord = {
      ...amChord,
      id: 'barre-test',
      name: 'Bm',
      startFret: 2,
      strings: [null, 2, 4, 4, 3, 2],
      fingers: [null, 1, 3, 4, 2, 1],
      barres: [2],
    }
    render(<ChordDiagram chord={barreChord} />)
    expect(screen.getByText('2fr')).toBeInTheDocument()
  })

  it('does not render fret indicator for open chords', () => {
    render(<ChordDiagram chord={amChord} />)
    expect(screen.queryByText(/fr/)).not.toBeInTheDocument()
  })

  it('renders finger dots with color matching finger number', () => {
    const { container } = render(<ChordDiagram chord={amChord} />)
    // Finger 1 = red (#ef4444), finger 2 = blue (#3b82f6), finger 3 = green (#22c55e)
    const circles = container.querySelectorAll('circle[fill]')
    const fills = Array.from(circles).map((c) => c.getAttribute('fill'))
    expect(fills).toContain('#ef4444')
    expect(fills).toContain('#3b82f6')
    expect(fills).toContain('#22c55e')
  })

  describe('barre chords', () => {
    const fChord: Chord = {
      id: 'f-major',
      name: 'F',
      rootNote: 'F',
      category: 'barre',
      strings: [1, 3, 3, 2, 1, 1],
      fingers: [1, 3, 4, 2, 1, 1],
      startFret: 1,
      barres: [1],
      isCustom: false,
    }

    it('renders a rounded rect for barre instead of a line', () => {
      const { container } = render(<ChordDiagram chord={fChord} />)
      const barreRect = container.querySelector('rect[data-testid="barre-1"]')
      expect(barreRect).toBeInTheDocument()
      expect(barreRect).toHaveAttribute('rx')
      expect(barreRect).toHaveAttribute('ry')
    })

    it('does not render individual circles for strings at the barre fret', () => {
      const { container } = render(<ChordDiagram chord={fChord} />)
      // F chord: strings 0,4,5 are at fret 1 (barre fret) with finger 1
      // Only strings 1,2,3 (frets 3,3,2) should have individual circles
      const circles = container.querySelectorAll('circle')
      expect(circles).toHaveLength(3)
    })

    it('renders finger number text inside the barre rect', () => {
      const { container } = render(<ChordDiagram chord={fChord} />)
      // The barre should show finger number "1" inside it
      const barreGroup = container.querySelector('[data-testid="barre-group-1"]')
      expect(barreGroup).toBeInTheDocument()
      expect(barreGroup?.querySelector('text')).toHaveTextContent('1')
    })
  })
})
