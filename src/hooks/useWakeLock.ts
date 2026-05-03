import { useState, useCallback, useRef } from 'react'

export function useWakeLock() {
  const isSupported = 'wakeLock' in navigator && navigator.wakeLock != null
  const [isActive, setIsActive] = useState(false)
  const sentinelRef = useRef<WakeLockSentinel | null>(null)

  const toggle = useCallback(async () => {
    if (isActive && sentinelRef.current) {
      await sentinelRef.current.release()
      sentinelRef.current = null
      setIsActive(false)
    } else {
      try {
        const sentinel = await navigator.wakeLock.request('screen')
        sentinelRef.current = sentinel
        setIsActive(true)
      } catch {
        setIsActive(false)
      }
    }
  }, [isActive])

  return { isActive, isSupported, toggle }
}
