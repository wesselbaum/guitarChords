interface WakeLockToggleProps {
  isActive: boolean
  isSupported: boolean
  onToggle: () => void
}

export function WakeLockToggle({ isActive, isSupported, onToggle }: WakeLockToggleProps) {
  if (!isSupported) return null

  const label = isActive ? 'Screen staying awake' : 'Keep screen awake'

  return (
    <button
      onClick={onToggle}
      aria-label={label}
      title={label}
      className={`p-2 rounded-lg transition-colors ${
        isActive
          ? 'text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900/30'
          : 'hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        {isActive ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        )}
      </svg>
    </button>
  )
}
