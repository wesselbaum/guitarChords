import { useEffect, useRef, useCallback } from 'react'

type ShortcutMap = Record<string, () => void>

const IGNORED_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT'])

function buildKey(e: KeyboardEvent): string {
  const parts: string[] = []
  if (e.ctrlKey || e.metaKey) parts.push('ctrl')
  if (e.shiftKey) parts.push('shift')
  if (e.altKey) parts.push('alt')
  parts.push(e.key.toLowerCase())
  return parts.join('+')
}

export function useKeyboardShortcuts(shortcuts: ShortcutMap): void {
  const shortcutsRef = useRef(shortcuts)

  useEffect(() => {
    shortcutsRef.current = shortcuts
  })

  const handler = useCallback((e: KeyboardEvent) => {
    const target = e.target as HTMLElement
    if (IGNORED_TAGS.has(target.tagName)) return

    const key = buildKey(e)
    const action = shortcutsRef.current[key]
    if (action) {
      e.preventDefault()
      action()
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [handler])
}
