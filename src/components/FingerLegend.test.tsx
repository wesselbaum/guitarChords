import { render, screen } from '@testing-library/react'
import { FingerLegend } from './FingerLegend'

describe('FingerLegend', () => {
  it('renders an SVG hand illustration', () => {
    const { container } = render(<FingerLegend />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('shows all four finger numbers', () => {
    render(<FingerLegend />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
  })

  it('renders colored finger paths for each finger', () => {
    const { container } = render(<FingerLegend />)
    const paths = container.querySelectorAll('path')
    const fills = Array.from(paths).map((p) => p.getAttribute('fill'))
    expect(fills).toContain('#ef4444')
    expect(fills).toContain('#3b82f6')
    expect(fills).toContain('#22c55e')
    expect(fills).toContain('#a855f7')
  })

  it('renders the hand silhouette with palm and fingers', () => {
    const { container } = render(<FingerLegend />)
    // 5 paths: palm+thumb combined, and 4 fingers
    const paths = container.querySelectorAll('path')
    expect(paths.length).toBe(5)
  })
})
