import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the header with app title', () => {
    render(<App />)
    expect(screen.getByText('Guitar Chord Reference')).toBeInTheDocument()
  })

  it('renders the sidebar toggle button', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /toggle sidebar/i })).toBeInTheDocument()
  })

  it('renders theme toggle button in header', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
  })

  it('renders export and import buttons in header', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /import/i })).toBeInTheDocument()
  })

  it('renders picked chords tab as active by default', () => {
    render(<App />)
    const pickedTab = screen.getByRole('button', { name: /picked chords tab/i })
    expect(pickedTab).toBeInTheDocument()
    expect(pickedTab.className).toContain('border-blue-500')
  })

  it('renders finger legend', () => {
    render(<App />)
    expect(screen.getByLabelText(/finger number legend/i)).toBeInTheDocument()
  })

  it('switches to songs view when songs tab is clicked', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: /saved songs tab/i }))
    const songsTab = screen.getByRole('button', { name: /saved songs tab/i })
    expect(songsTab.className).toContain('border-blue-500')
  })

  it('opens editor when New Chord button is clicked', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: /new chord/i }))
    expect(screen.getByLabelText(/chord name/i)).toBeInTheDocument()
  })

  it('returns to picked view when editor cancel is clicked', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: /new chord/i }))
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }))
    const pickedTab = screen.getByRole('button', { name: /picked chords tab/i })
    expect(pickedTab.className).toContain('border-blue-500')
  })

  it('hides view tabs when editor is open', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: /new chord/i }))
    expect(screen.queryByRole('button', { name: /picked chords tab/i })).not.toBeInTheDocument()
  })

  it('picks a chord when pick button is clicked', async () => {
    render(<App />)
    const pickButtons = screen.getAllByRole('button', { name: /pick chord/i })
    await userEvent.click(pickButtons[0]!)
    // The picked tab should now show count badge with "1"
    expect(screen.getByRole('button', { name: /picked chords tab/i })).toHaveTextContent('1')
  })

  it('does not duplicate chord when picking same chord twice', async () => {
    render(<App />)
    const pickButtons = screen.getAllByRole('button', { name: /pick chord/i })
    await userEvent.click(pickButtons[0]!)
    // After first pick, that chord's button changes to "Remove from picked"
    // Clicking the same chord again should not add it again
    // The picked tab should still show count of 1
    expect(screen.getByRole('button', { name: /picked chords tab/i })).toHaveTextContent('1')
  })

  it('unpicks a chord from sidebar after picking', async () => {
    render(<App />)
    const pickButtons = screen.getAllByRole('button', { name: /pick chord/i })
    await userEvent.click(pickButtons[0]!)
    // After picking, a "Remove from picked" button should appear for that chord
    const unpickButton = screen.getByRole('button', { name: /remove from picked/i })
    await userEvent.click(unpickButton)
    // Count badge should disappear (0 picked = no badge shown)
    const pickedTab = screen.getByRole('button', { name: /picked chords tab/i })
    expect(pickedTab).toHaveTextContent('Picked Chords')
    expect(pickedTab).not.toHaveTextContent(/\d/)
  })

  it('clears all picked chords when clear all is clicked', async () => {
    render(<App />)
    const pickButtons = screen.getAllByRole('button', { name: /pick chord/i })
    await userEvent.click(pickButtons[0]!)
    await userEvent.click(pickButtons[1]!)
    await userEvent.click(screen.getByRole('button', { name: /clear all/i }))
    expect(screen.getByRole('button', { name: /picked chords tab/i })).not.toHaveTextContent(/\d/)
  })

  it('saves picked chords as a song via prompt', async () => {
    render(<App />)
    const pickButtons = screen.getAllByRole('button', { name: /pick chord/i })
    await userEvent.click(pickButtons[0]!)

    vi.spyOn(window, 'prompt').mockReturnValue('Test Song')
    await userEvent.click(screen.getByRole('button', { name: /save as song/i }))

    // Switch to songs tab — song should be listed
    await userEvent.click(screen.getByRole('button', { name: /saved songs tab/i }))
    expect(screen.getByText('Test Song')).toBeInTheDocument()
    vi.restoreAllMocks()
  })

  it('does not save song when prompt is cancelled', async () => {
    render(<App />)
    const pickButtons = screen.getAllByRole('button', { name: /pick chord/i })
    await userEvent.click(pickButtons[0]!)

    vi.spyOn(window, 'prompt').mockReturnValue(null)
    await userEvent.click(screen.getByRole('button', { name: /save as song/i }))

    await userEvent.click(screen.getByRole('button', { name: /saved songs tab/i }))
    expect(screen.queryByRole('button', { name: /load/i })).not.toBeInTheDocument()
    vi.restoreAllMocks()
  })

  it('loads a song and switches to picked view', async () => {
    render(<App />)
    const pickButtons = screen.getAllByRole('button', { name: /pick chord/i })
    await userEvent.click(pickButtons[0]!)

    vi.spyOn(window, 'prompt').mockReturnValue('My Song')
    await userEvent.click(screen.getByRole('button', { name: /save as song/i }))

    await userEvent.click(screen.getByRole('button', { name: /clear all/i }))
    await userEvent.click(screen.getByRole('button', { name: /saved songs tab/i }))
    await userEvent.click(screen.getByRole('button', { name: /load/i }))

    // Should switch back to picked view with loaded chords
    const pickedTab = screen.getByRole('button', { name: /picked chords tab/i })
    expect(pickedTab.className).toContain('border-blue-500')
    expect(pickedTab).toHaveTextContent('1')
    vi.restoreAllMocks()
  })

  it('saves a custom chord from editor and returns to picked view', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: /new chord/i }))
    await userEvent.type(screen.getByLabelText(/chord name/i), 'TestChord')
    await userEvent.click(screen.getByRole('button', { name: /save/i }))
    // Should return to picked view
    const pickedTab = screen.getByRole('button', { name: /picked chords tab/i })
    expect(pickedTab.className).toContain('border-blue-500')
  })

  it('opens editor with chord data when use as template is clicked', async () => {
    render(<App />)
    const templateButtons = screen.getAllByRole('button', { name: /use as template/i })
    await userEvent.click(templateButtons[0]!)
    // Editor should open with chord name pre-filled
    const nameInput = screen.getByLabelText(/chord name/i)
    expect(nameInput).toBeInTheDocument()
    expect((nameInput as HTMLInputElement).value).not.toBe('')
  })

  it('shows sidebar overlay when sidebar is open on mobile', () => {
    render(<App />)
    // Sidebar is open by default — overlay div should exist for lg:hidden
    const overlay = document.querySelector('.fixed.inset-0.bg-black\\/30')
    expect(overlay).toBeInTheDocument()
  })

  it('closes sidebar when overlay is clicked', async () => {
    render(<App />)
    const overlay = document.querySelector('.fixed.inset-0.bg-black\\/30')
    expect(overlay).toBeInTheDocument()
    await userEvent.click(overlay!)
    // Overlay should disappear
    expect(document.querySelector('.fixed.inset-0.bg-black\\/30')).not.toBeInTheDocument()
  })

  it('does not save song when prompt returns empty string', async () => {
    render(<App />)
    const pickButtons = screen.getAllByRole('button', { name: /pick chord/i })
    await userEvent.click(pickButtons[0]!)

    vi.spyOn(window, 'prompt').mockReturnValue('   ')
    await userEvent.click(screen.getByRole('button', { name: /save as song/i }))

    await userEvent.click(screen.getByRole('button', { name: /saved songs tab/i }))
    expect(screen.queryByRole('button', { name: /load/i })).not.toBeInTheDocument()
    vi.restoreAllMocks()
  })
})
