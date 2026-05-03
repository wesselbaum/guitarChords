import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ViewTabs } from './ViewTabs'

const defaultProps = {
  activeView: 'picked' as const,
  onChangeView: vi.fn(),
  pickedCount: 0,
  songsCount: 0,
}

describe('ViewTabs', () => {
  it('renders picked chords tab', () => {
    render(<ViewTabs {...defaultProps} />)
    expect(
      screen.getByRole('button', { name: /picked chords tab/i })
    ).toBeInTheDocument()
  })

  it('renders saved songs tab', () => {
    render(<ViewTabs {...defaultProps} />)
    expect(
      screen.getByRole('button', { name: /saved songs tab/i })
    ).toBeInTheDocument()
  })

  it('calls onChangeView with picked when picked tab clicked', async () => {
    const onChangeView = vi.fn()
    render(
      <ViewTabs
        {...defaultProps}
        activeView="songs"
        onChangeView={onChangeView}
      />
    )
    await userEvent.click(
      screen.getByRole('button', { name: /picked chords tab/i })
    )
    expect(onChangeView).toHaveBeenCalledWith('picked')
  })

  it('calls onChangeView with songs when songs tab clicked', async () => {
    const onChangeView = vi.fn()
    render(<ViewTabs {...defaultProps} onChangeView={onChangeView} />)
    await userEvent.click(
      screen.getByRole('button', { name: /saved songs tab/i })
    )
    expect(onChangeView).toHaveBeenCalledWith('songs')
  })

  it('shows picked count badge when chords are picked', () => {
    render(<ViewTabs {...defaultProps} pickedCount={3} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('does not show picked count badge when no chords picked', () => {
    render(<ViewTabs {...defaultProps} pickedCount={0} />)
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('shows songs count badge when songs exist', () => {
    render(<ViewTabs {...defaultProps} songsCount={5} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('does not show songs count badge when no songs', () => {
    render(<ViewTabs {...defaultProps} songsCount={0} />)
    const buttons = screen.getAllByRole('button')
    buttons.forEach((btn) => {
      expect(btn.textContent).not.toContain('0')
    })
  })

  it('picked tab has title attribute', () => {
    render(<ViewTabs {...defaultProps} />)
    expect(
      screen.getByRole('button', { name: /picked chords tab/i })
    ).toHaveAttribute('title')
  })

  it('songs tab has title attribute', () => {
    render(<ViewTabs {...defaultProps} />)
    expect(
      screen.getByRole('button', { name: /saved songs tab/i })
    ).toHaveAttribute('title')
  })
})
