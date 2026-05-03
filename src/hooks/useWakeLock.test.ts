import { renderHook, act } from '@testing-library/react'
import { useWakeLock } from './useWakeLock'

const releaseMock = vi.fn().mockResolvedValue(undefined)

function createWakeLockSentinel(): WakeLockSentinel {
  return {
    released: false,
    type: 'screen',
    release: releaseMock,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    onrelease: null,
    dispatchEvent: vi.fn(),
  }
}

describe('useWakeLock', () => {
  let requestMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    releaseMock.mockClear()
    requestMock = vi.fn().mockResolvedValue(createWakeLockSentinel())
    Object.defineProperty(navigator, 'wakeLock', {
      value: { request: requestMock },
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    Object.defineProperty(navigator, 'wakeLock', {
      value: undefined,
      writable: true,
      configurable: true,
    })
  })

  it('starts with wake lock inactive', () => {
    const { result } = renderHook(() => useWakeLock())
    expect(result.current.isActive).toBe(false)
    expect(result.current.isSupported).toBe(true)
  })

  it('reports unsupported when API unavailable', () => {
    Object.defineProperty(navigator, 'wakeLock', {
      value: undefined,
      writable: true,
      configurable: true,
    })
    const { result } = renderHook(() => useWakeLock())
    expect(result.current.isSupported).toBe(false)
  })

  it('requests wake lock when toggled on', async () => {
    const { result } = renderHook(() => useWakeLock())
    await act(async () => {
      await result.current.toggle()
    })
    expect(requestMock).toHaveBeenCalledWith('screen')
    expect(result.current.isActive).toBe(true)
  })

  it('releases wake lock when toggled off', async () => {
    const { result } = renderHook(() => useWakeLock())
    await act(async () => {
      await result.current.toggle()
    })
    expect(result.current.isActive).toBe(true)
    await act(async () => {
      await result.current.toggle()
    })
    expect(releaseMock).toHaveBeenCalled()
    expect(result.current.isActive).toBe(false)
  })

  it('handles request failure gracefully', async () => {
    requestMock.mockRejectedValueOnce(new Error('NotAllowedError'))
    const { result } = renderHook(() => useWakeLock())
    await act(async () => {
      await result.current.toggle()
    })
    expect(result.current.isActive).toBe(false)
  })
})
