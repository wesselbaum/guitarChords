import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PickedChordsView } from './PickedChordsView'
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

const defaultProps = {
  pickedChords: [] as Chord[],
  onRemoveChord: vi.fn(),
  onClearAll: vi.fn(),
  onSaveAsSong: vi.fn(),
}

describe('PickedChordsView', () => {
  it('shows empty state message when no chords picked', () => {
    render(<PickedChordsView {...defaultProps} />)
    expect(
      screen.getByText(/pick chords from the library/i)
    ).toBeInTheDocument()
  })

  it('renders chord diagrams for picked chords', () => {
    render(
      <PickedChordsView {...defaultProps} pickedChords={[amChord, cChord]} />
    )
    expect(screen.getByText('Am')).toBeInTheDocument()
    expect(screen.getByText('C')).toBeInTheDocument()
  })

  it('shows save as song button when chords are picked', () => {
    render(
      <PickedChordsView {...defaultProps} pickedChords={[amChord]} />
    )
    expect(
      screen.getByRole('button', { name: /save as song/i })
    ).toBeInTheDocument()
  })

  it('does not show save as song button when no chords picked', () => {
    render(<PickedChordsView {...defaultProps} />)
    expect(
      screen.queryByRole('button', { name: /save as song/i })
    ).not.toBeInTheDocument()
  })

  it('shows clear all button when chords are picked', () => {
    render(
      <PickedChordsView {...defaultProps} pickedChords={[amChord]} />
    )
    expect(
      screen.getByRole('button', { name: /clear all/i })
    ).toBeInTheDocument()
  })

  it('does not show clear all button when no chords picked', () => {
    render(<PickedChordsView {...defaultProps} />)
    expect(
      screen.queryByRole('button', { name: /clear all/i })
    ).not.toBeInTheDocument()
  })

  it('calls onClearAll when clear all button clicked', async () => {
    const onClearAll = vi.fn()
    render(
      <PickedChordsView
        {...defaultProps}
        pickedChords={[amChord]}
        onClearAll={onClearAll}
      />
    )
    await userEvent.click(
      screen.getByRole('button', { name: /clear all/i })
    )
    expect(onClearAll).toHaveBeenCalled()
  })

  it('calls onSaveAsSong when save as song button clicked', async () => {
    const onSaveAsSong = vi.fn()
    render(
      <PickedChordsView
        {...defaultProps}
        pickedChords={[amChord, cChord]}
        onSaveAsSong={onSaveAsSong}
      />
    )
    await userEvent.click(
      screen.getByRole('button', { name: /save as song/i })
    )
    expect(onSaveAsSong).toHaveBeenCalled()
  })

  it('shows remove button for each picked chord', () => {
    render(
      <PickedChordsView {...defaultProps} pickedChords={[amChord, cChord]} />
    )
    const removeButtons = screen.getAllByRole('button', { name: /remove/i })
    expect(removeButtons).toHaveLength(2)
  })

  it('calls onRemoveChord with chord id when remove button clicked', async () => {
    const onRemoveChord = vi.fn()
    render(
      <PickedChordsView
        {...defaultProps}
        pickedChords={[amChord]}
        onRemoveChord={onRemoveChord}
      />
    )
    await userEvent.click(
      screen.getByRole('button', { name: /remove am/i })
    )
    expect(onRemoveChord).toHaveBeenCalledWith('am')
  })

  it('save as song button has title attribute', () => {
    render(
      <PickedChordsView {...defaultProps} pickedChords={[amChord]} />
    )
    expect(
      screen.getByRole('button', { name: /save as song/i })
    ).toHaveAttribute('title')
  })

  it('clear all button has title attribute', () => {
    render(
      <PickedChordsView {...defaultProps} pickedChords={[amChord]} />
    )
    expect(
      screen.getByRole('button', { name: /clear all/i })
    ).toHaveAttribute('title')
  })

  it('remove chord buttons have title attributes', () => {
    render(
      <PickedChordsView {...defaultProps} pickedChords={[amChord]} />
    )
    const removeBtn = screen.getByRole('button', { name: /remove am/i })
    expect(removeBtn).toHaveAttribute('title')
  })
})
