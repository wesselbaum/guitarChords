import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from './ThemeToggle'

describe('ThemeToggle', () => {
  it('renders a button showing current theme', () => {
    render(<ThemeToggle theme="light" onToggle={() => {}} />)
    expect(screen.getByRole('button', { name: /theme/i })).toBeInTheDocument()
  })

  it('calls onToggle when clicked', async () => {
    const onToggle = vi.fn()
    render(<ThemeToggle theme="light" onToggle={onToggle} />)
    await userEvent.click(screen.getByRole('button', { name: /theme/i }))
    expect(onToggle).toHaveBeenCalledOnce()
  })

  it('shows sun icon for light theme', () => {
    render(<ThemeToggle theme="light" onToggle={() => {}} />)
    expect(screen.getByTestId('icon-sun')).toBeInTheDocument()
  })

  it('shows moon icon for dark theme', () => {
    render(<ThemeToggle theme="dark" onToggle={() => {}} />)
    expect(screen.getByTestId('icon-moon')).toBeInTheDocument()
  })

  it('shows system icon for system theme', () => {
    render(<ThemeToggle theme="system" onToggle={() => {}} />)
    expect(screen.getByTestId('icon-system')).toBeInTheDocument()
  })
})
