import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExportImport } from './ExportImport'

describe('ExportImport', () => {
  it('renders export button', () => {
    render(<ExportImport onExport={() => ''} onImport={() => {}} />)
    expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument()
  })

  it('renders import button', () => {
    render(<ExportImport onExport={() => ''} onImport={() => {}} />)
    expect(screen.getByRole('button', { name: /import/i })).toBeInTheDocument()
  })

  it('calls onExport when export button is clicked', async () => {
    const onExport = vi.fn(() => '{"test": true}')
    render(<ExportImport onExport={onExport} onImport={() => {}} />)
    await userEvent.click(screen.getByRole('button', { name: /export/i }))
    expect(onExport).toHaveBeenCalledOnce()
  })

  it('export button has title attribute', () => {
    render(<ExportImport onExport={() => ''} onImport={() => {}} />)
    expect(screen.getByRole('button', { name: /export/i })).toHaveAttribute('title')
  })

  it('import button has title attribute', () => {
    render(<ExportImport onExport={() => ''} onImport={() => {}} />)
    expect(screen.getByRole('button', { name: /import/i })).toHaveAttribute('title')
  })
})
