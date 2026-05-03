import type React from 'react'
import type { ThemeMode } from '../types/chord'

interface ThemeToggleProps {
  theme: ThemeMode
  onToggle: () => void
}

function SunIcon() {
  return (
    <svg data-testid="icon-sun" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg data-testid="icon-moon" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  )
}

function SystemIcon() {
  return (
    <svg data-testid="icon-system" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}

const iconMap: Record<ThemeMode, () => React.JSX.Element> = {
  light: SunIcon,
  dark: MoonIcon,
  system: SystemIcon,
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const Icon = iconMap[theme]

  return (
    <button
      onClick={onToggle}
      aria-label={`Toggle theme (current: ${theme})`}
      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    >
      <Icon />
    </button>
  )
}
