import type { FingerNumber } from '../types/chord'

export interface FingerColorConfig {
  fill: string
  darkFill: string
  label: string
  tailwindBg: string
  tailwindText: string
}

export const FINGER_COLORS: Record<1 | 2 | 3 | 4, FingerColorConfig> = {
  1: {
    fill: '#ef4444',      // red-500
    darkFill: '#dc2626',  // red-600
    label: 'Index',
    tailwindBg: 'bg-red-500',
    tailwindText: 'text-red-500',
  },
  2: {
    fill: '#3b82f6',      // blue-500
    darkFill: '#2563eb',  // blue-600
    label: 'Middle',
    tailwindBg: 'bg-blue-500',
    tailwindText: 'text-blue-500',
  },
  3: {
    fill: '#22c55e',      // green-500
    darkFill: '#16a34a',  // green-600
    label: 'Ring',
    tailwindBg: 'bg-green-500',
    tailwindText: 'text-green-500',
  },
  4: {
    fill: '#a855f7',      // purple-500
    darkFill: '#9333ea',  // purple-600
    label: 'Pinky',
    tailwindBg: 'bg-purple-500',
    tailwindText: 'text-purple-500',
  },
}

export function getFingerColor(finger: FingerNumber): string {
  if (finger === null) return 'currentColor'
  return FINGER_COLORS[finger].fill
}
