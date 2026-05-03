import { FINGER_COLORS } from '../data/fingerColors'

export function FingerLegend() {
  const baseFill = '#374151'
  const darkClass = 'dark:fill-gray-400'

  return (
    <svg
      width="80"
      height="80"
      viewBox="40 -10 480 530"
      aria-label="Finger number legend"
    >
      {/* Full hand silhouette as dark base */}
      <path
        d="M432.8,211.44h0c-15.52-8.82-34.91-2.28-43.31,13.68l-41.38,84.41a7,7,0,0,1-8.93,3.43h0a7,7,0,0,1-4.41-6.52V72c0-13.91-12.85-24-26.77-24s-26,10.09-26,24V228.64A11.24,11.24,0,0,1,271.21,240,11,11,0,0,1,260,229V24c0-13.91-10.94-24-24.86-24S210,10.09,210,24V228.64A11.24,11.24,0,0,1,199.21,240,11,11,0,0,1,188,229V56c0-13.91-12.08-24-26-24s-26,11.09-26,25V244.64A11.24,11.24,0,0,1,125.21,256,11,11,0,0,1,114,245V120c0-13.91-11.08-24-25-24s-25.12,10.22-25,24V336c0,117.41,72,176,160,176h16c88,0,115.71-39.6,136-88l68.71-169C451.33,237,448.31,220.25,432.8,211.44Z"
        fill={baseFill}
        className={darkClass}
      />

      {/* Finger 4 — Pinky (leftmost) */}
      <path
        d="M114,245V120c0-13.91-11.08-24-25-24s-25.12,10.22-25,24V245Z"
        fill={FINGER_COLORS[4].fill}
      />
      <text x="89" y="195" textAnchor="middle" fontSize="36" fill="white" fontWeight="bold">4</text>

      {/* Finger 3 — Ring */}
      <path
        d="M188,229V56c0-13.91-12.08-24-26-24s-26,11.09-26,25V244.64A11.24,11.24,0,0,0,147.21,256h29.58A11.24,11.24,0,0,0,188,244.64Z"
        fill={FINGER_COLORS[3].fill}
      />
      <text x="162" y="175" textAnchor="middle" fontSize="36" fill="white" fontWeight="bold">3</text>

      {/* Finger 2 — Middle */}
      <path
        d="M260,229V24c0-13.91-10.94-24-24.86-24S210,10.09,210,24V228.64A11.24,11.24,0,0,0,221.21,240h27.58A11.24,11.24,0,0,0,260,228.64Z"
        fill={FINGER_COLORS[2].fill}
      />
      <text x="235" y="165" textAnchor="middle" fontSize="36" fill="white" fontWeight="bold">2</text>

      {/* Finger 1 — Index */}
      <path
        d="M334.77,306.44V72c0-13.91-12.85-24-26.77-24s-26,10.09-26,24V228.64A11.24,11.24,0,0,0,293.21,240h30.35A11.24,11.24,0,0,0,334.77,228.64Z"
        fill={FINGER_COLORS[1].fill}
      />
      <text x="308" y="175" textAnchor="middle" fontSize="36" fill="white" fontWeight="bold">1</text>
    </svg>
  )
}
