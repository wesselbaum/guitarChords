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
})
