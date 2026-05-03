import { useState, useEffect, useCallback } from 'react'
import type { ThemeMode } from '../types/chord'

const STORAGE_KEY = 'guitar-chords-theme'

function getStoredTheme(): ThemeMode {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored
  }
  return 'system'
}

function applyTheme(theme: ThemeMode): void {
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  if (isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(getStoredTheme)

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme)
    localStorage.setItem(STORAGE_KEY, newTheme)
    applyTheme(newTheme)
  }, [])

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  return { theme, setTheme }
}
