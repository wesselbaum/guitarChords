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

  it('clicking import button triggers hidden file input click', async () => {
    const { container } = render(<ExportImport onExport={() => ''} onImport={() => {}} />)
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement
    const clickSpy = vi.spyOn(fileInput, 'click')
    await userEvent.click(screen.getByRole('button', { name: /import/i }))
    expect(clickSpy).toHaveBeenCalledOnce()
    clickSpy.mockRestore()
  })

  it('calls onImport with file contents when a file is selected', async () => {
    const onImport = vi.fn()
    const { container } = render(<ExportImport onExport={() => ''} onImport={onImport} />)
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement

    const fileContent = '{"songs":[]}'
    const file = new File([fileContent], 'backup.json', { type: 'application/json' })

    await userEvent.upload(fileInput, file)
    // FileReader is async, wait for onImport
    await vi.waitFor(() => {
      expect(onImport).toHaveBeenCalledWith(fileContent)
    })
  })

  it('resets file input value after import', async () => {
    const { container } = render(<ExportImport onExport={() => ''} onImport={() => {}} />)
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement

    const file = new File(['{}'], 'backup.json', { type: 'application/json' })
    await userEvent.upload(fileInput, file)

    await vi.waitFor(() => {
      expect(fileInput.value).toBe('')
    })
  })

  it('does not call onImport when no file is selected', () => {
    const onImport = vi.fn()
    const { container } = render(<ExportImport onExport={() => ''} onImport={onImport} />)
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement

    // Fire change event with empty file list
    const event = new Event('change', { bubbles: true })
    Object.defineProperty(event, 'target', { value: { files: [] } })
    fileInput.dispatchEvent(event)

    expect(onImport).not.toHaveBeenCalled()
  })
})
