import type { StringFret, FingerNumber } from '../types/chord'

interface EditorFretboardProps {
  strings: [StringFret, StringFret, StringFret, StringFret, StringFret, StringFret]
  fingers: [FingerNumber, FingerNumber, FingerNumber, FingerNumber, FingerNumber, FingerNumber]
  startFret: number
  onFretClick: (stringIndex: number, fret: number) => void
  onStringToggle: (stringIndex: number) => void
  onFingerClick: (stringIndex: number) => void
}

const WIDTH = 250
const HEIGHT = 300
const STRING_COUNT = 6
const FRET_COUNT = 5
const PAD_TOP = 40
const PAD_BOTTOM = 10
const PAD_LEFT = 30
const PAD_RIGHT = 10
const DOT_RADIUS = 10
const MARKER_SIZE = 14

function getLayout() {
  const fbWidth = WIDTH - PAD_LEFT - PAD_RIGHT
  const fbHeight = HEIGHT - PAD_TOP - PAD_BOTTOM
  const stringSpacing = fbWidth / (STRING_COUNT - 1)
  const fretSpacing = fbHeight / FRET_COUNT
  return { fbWidth, fbHeight, stringSpacing, fretSpacing }
}

function stringX(index: number, spacing: number): number {
  return PAD_LEFT + index * spacing
}

function fretY(fret: number, spacing: number): number {
  return PAD_TOP + fret * spacing
}

export function EditorFretboard({
  strings,
  fingers,
  startFret,
  onFretClick,
  onStringToggle,
  onFingerClick,
}: EditorFretboardProps) {
  const layout = getLayout()
  const showNut = startFret <= 1

  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="text-gray-900 dark:text-gray-100">
      {/* Nut */}
      <line
        x1={PAD_LEFT} y1={PAD_TOP}
        x2={PAD_LEFT + layout.fbWidth} y2={PAD_TOP}
        stroke="currentColor" strokeWidth={showNut ? 4 : 1}
      />

      {/* Fret lines */}
      {Array.from({ length: FRET_COUNT }, (_, i) => (
        <line
          key={`fret-${i}`}
          x1={PAD_LEFT} y1={fretY(i + 1, layout.fretSpacing)}
          x2={PAD_LEFT + layout.fbWidth} y2={fretY(i + 1, layout.fretSpacing)}
          stroke="currentColor" strokeWidth={1} opacity={0.4}
        />
      ))}

      {/* String lines */}
      {Array.from({ length: STRING_COUNT }, (_, i) => (
        <line
          key={`string-${i}`}
          x1={stringX(i, layout.stringSpacing)} y1={PAD_TOP}
          x2={stringX(i, layout.stringSpacing)} y2={PAD_TOP + layout.fbHeight}
          stroke="currentColor" strokeWidth={1} opacity={0.6}
        />
      ))}

      {/* Click zones for string header (open/muted toggle) */}
      {Array.from({ length: STRING_COUNT }, (_, i) => (
        <rect
          key={`header-${i}`}
          x={stringX(i, layout.stringSpacing) - layout.stringSpacing / 2}
          y={0}
          width={layout.stringSpacing}
          height={PAD_TOP}
          fill="transparent"
          className="cursor-pointer"
          onClick={() => onStringToggle(i)}
          data-testid={`string-toggle-${i}`}
        />
      ))}

      {/* Open/Muted markers */}
      {strings.map((fret, i) => {
        const x = stringX(i, layout.stringSpacing)
        const y = PAD_TOP - MARKER_SIZE
        if (fret === null) {
          return <text key={`m-${i}`} x={x} y={y} textAnchor="middle" fontSize={MARKER_SIZE} fill="currentColor">X</text>
        }
        if (fret === 0) {
          return <text key={`m-${i}`} x={x} y={y} textAnchor="middle" fontSize={MARKER_SIZE} fill="currentColor">O</text>
        }
        return null
      })}

      {/* Click zones for fret intersections */}
      {Array.from({ length: STRING_COUNT }, (_, si) =>
        Array.from({ length: FRET_COUNT }, (_, fi) => {
          const absoluteFret = startFret + fi
          const x = stringX(si, layout.stringSpacing)
          const y = fretY(fi + 0.5, layout.fretSpacing)
          return (
            <circle
              key={`click-${si}-${fi}`}
              cx={x} cy={y} r={DOT_RADIUS + 4}
              fill="transparent"
              className="cursor-pointer"
              onClick={() => onFretClick(si, absoluteFret)}
              data-testid={`fret-${si}-${fi}`}
            />
          )
        })
      )}

      {/* Finger dots */}
      {strings.map((fret, i) => {
        if (fret === null || fret === 0) return null
        const displayFret = fret - startFret + 1
        const x = stringX(i, layout.stringSpacing)
        const y = fretY(displayFret - 0.5, layout.fretSpacing)
        const finger = fingers[i]
        return (
          <g key={`dot-${i}`}>
            <circle cx={x} cy={y} r={DOT_RADIUS} fill="currentColor" />
            {finger !== null && (
              <g
                data-testid={`finger-btn-${i}`}
                className="cursor-pointer"
                onClick={(e) => { e.stopPropagation(); onFingerClick(i) }}
              >
                <circle cx={x} cy={y} r={DOT_RADIUS} fill="currentColor" opacity={0} />
                <text x={x} y={y + DOT_RADIUS * 0.35} textAnchor="middle" fontSize={DOT_RADIUS * 1.2} fill="white" className="dark:fill-gray-900 pointer-events-none">
                  {finger}
                </text>
              </g>
            )}
          </g>
        )
      })}

      {/* Start fret indicator */}
      {startFret > 1 && (
        <text x={PAD_LEFT - 18} y={fretY(0.5, layout.fretSpacing) + 4} textAnchor="middle" fontSize={12} fill="currentColor">
          {startFret}fr
        </text>
      )}
    </svg>
  )
}
