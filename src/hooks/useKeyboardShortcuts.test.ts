import { renderHook } from '@testing-library/react'
import { useKeyboardShortcuts } from './useKeyboardShortcuts'

describe('useKeyboardShortcuts', () => {
  it('calls handler when registered key is pressed', () => {
    const handler = vi.fn()
    renderHook(() =>
      useKeyboardShortcuts({ '/': handler })
    )
    const event = new KeyboardEvent('keydown', { key: '/' })
    document.dispatchEvent(event)
    expect(handler).toHaveBeenCalledOnce()
  })

  it('does not call handler for unregistered keys', () => {
    const handler = vi.fn()
    renderHook(() =>
      useKeyboardShortcuts({ '/': handler })
    )
    const event = new KeyboardEvent('keydown', { key: 'a' })
    document.dispatchEvent(event)
    expect(handler).not.toHaveBeenCalled()
  })

  it('ignores key events from input elements', () => {
    const handler = vi.fn()
    renderHook(() =>
      useKeyboardShortcuts({ '/': handler })
    )
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.focus()
    const event = new KeyboardEvent('keydown', { key: '/', bubbles: true })
    input.dispatchEvent(event)
    expect(handler).not.toHaveBeenCalled()
    document.body.removeChild(input)
  })

  it('supports ctrl+key combinations', () => {
    const handler = vi.fn()
    renderHook(() =>
      useKeyboardShortcuts({ 'ctrl+s': handler })
    )
    const event = new KeyboardEvent('keydown', { key: 's', ctrlKey: true })
    document.dispatchEvent(event)
    expect(handler).toHaveBeenCalledOnce()
  })
})
