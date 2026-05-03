import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WakeLockToggle } from './WakeLockToggle'

describe('WakeLockToggle', () => {
  it('renders toggle button when supported', () => {
    const onToggle = vi.fn()
    render(<WakeLockToggle isActive={false} isSupported={true} onToggle={onToggle} />)
    expect(screen.getByRole('button', { name: /keep screen awake/i })).toBeInTheDocument()
  })

  it('does not render when unsupported', () => {
    const onToggle = vi.fn()
    render(<WakeLockToggle isActive={false} isSupported={false} onToggle={onToggle} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('calls onToggle when clicked', async () => {
    const onToggle = vi.fn()
    render(<WakeLockToggle isActive={false} isSupported={true} onToggle={onToggle} />)
    await userEvent.click(screen.getByRole('button', { name: /keep screen awake/i }))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('shows active state label when wake lock is on', () => {
    const onToggle = vi.fn()
    render(<WakeLockToggle isActive={true} isSupported={true} onToggle={onToggle} />)
    expect(screen.getByRole('button', { name: /screen staying awake/i })).toBeInTheDocument()
  })
})
