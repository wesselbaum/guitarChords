import type { Chord } from '../types/chord'

interface ChordDiagramProps {
  chord: Chord
  size?: 'sm' | 'md' | 'lg'
}

const SIZES = {
  sm: { width: 80, height: 100, fontSize: 10, dotRadius: 5, markerSize: 8 },
  md: { width: 120, height: 150, fontSize: 14, dotRadius: 7, markerSize: 12 },
  lg: { width: 160, height: 200, fontSize: 18, dotRadius: 9, markerSize: 14 },
}

const STRING_COUNT = 6
const FRET_COUNT = 5
const PADDING_TOP = 30
const PADDING_BOTTOM = 10
const PADDING_LEFT = 20
const PADDING_RIGHT = 10

function calculateLayout(width: number, height: number) {
  const fretboardWidth = width - PADDING_LEFT - PADDING_RIGHT
  const fretboardHeight = height - PADDING_TOP - PADDING_BOTTOM
  const stringSpacing = fretboardWidth / (STRING_COUNT - 1)
  const fretSpacing = fretboardHeight / FRET_COUNT

  return { fretboardWidth, fretboardHeight, stringSpacing, fretSpacing }
}

function getStringX(index: number, stringSpacing: number): number {
  return PADDING_LEFT + index * stringSpacing
}

function getFretY(fret: number, fretSpacing: number): number {
  return PADDING_TOP + fret * fretSpacing
}

export function ChordDiagram({ chord, size = 'md' }: ChordDiagramProps) {
  const dims = SIZES[size]
  const layout = calculateLayout(dims.width, dims.height)
  const showNut = chord.startFret <= 1

  return (
    <div className="flex flex-col items-center">
      <span className="font-bold text-sm mb-1 dark:text-gray-100">{chord.name}</span>
      <svg
        width={dims.width}
        height={dims.height}
        viewBox={`0 0 ${dims.width} ${dims.height}`}
        className="text-gray-900 dark:text-gray-100"
      >
        {/* Nut or top fret line */}
        <line
          x1={PADDING_LEFT}
          y1={PADDING_TOP}
          x2={PADDING_LEFT + layout.fretboardWidth}
          y2={PADDING_TOP}
          stroke="currentColor"
          strokeWidth={showNut ? 3 : 1}
        />

        {/* Fret lines */}
        {Array.from({ length: FRET_COUNT }, (_, i) => (
          <line
            key={`fret-${i}`}
            x1={PADDING_LEFT}
            y1={getFretY(i + 1, layout.fretSpacing)}
            x2={PADDING_LEFT + layout.fretboardWidth}
            y2={getFretY(i + 1, layout.fretSpacing)}
            stroke="currentColor"
            strokeWidth={1}
            opacity={0.4}
          />
        ))}

        {/* String lines */}
        {Array.from({ length: STRING_COUNT }, (_, i) => (
          <line
            key={`string-${i}`}
            x1={getStringX(i, layout.stringSpacing)}
            y1={PADDING_TOP}
            x2={getStringX(i, layout.stringSpacing)}
            y2={PADDING_TOP + layout.fretboardHeight}
            stroke="currentColor"
            strokeWidth={1}
            opacity={0.6}
          />
        ))}

        {/* Open/Muted markers */}
        {chord.strings.map((fret, i) => {
          const x = getStringX(i, layout.stringSpacing)
          const y = PADDING_TOP - dims.markerSize

          if (fret === null) {
            return (
              <text
                key={`marker-${i}`}
                x={x}
                y={y}
                textAnchor="middle"
                fontSize={dims.markerSize}
                fill="currentColor"
              >
                X
              </text>
            )
          }

          if (fret === 0) {
            return (
              <text
                key={`marker-${i}`}
                x={x}
                y={y}
                textAnchor="middle"
                fontSize={dims.markerSize}
                fill="currentColor"
              >
                O
              </text>
            )
          }

          return null
        })}

        {/* Start fret indicator */}
        {chord.startFret > 1 && (
          <text
            x={PADDING_LEFT - 14}
            y={getFretY(0.5, layout.fretSpacing) + 4}
            textAnchor="middle"
            fontSize={dims.fontSize * 0.7}
            fill="currentColor"
          >
            {chord.startFret}fr
          </text>
        )}

        {/* Finger dots */}
        {chord.strings.map((fret, i) => {
          if (fret === null || fret === 0) return null

          const displayFret = fret - chord.startFret + 1
          const x = getStringX(i, layout.stringSpacing)
          const y = getFretY(displayFret - 0.5, layout.fretSpacing)
          const finger = chord.fingers[i]

          return (
            <g key={`dot-${i}`}>
              <circle
                cx={x}
                cy={y}
                r={dims.dotRadius}
                fill="currentColor"
              />
              {finger !== null && (
                <text
                  x={x}
                  y={y + dims.dotRadius * 0.35}
                  textAnchor="middle"
                  fontSize={dims.dotRadius * 1.2}
                  fill="white"
                  className="dark:fill-gray-900"
                >
                  {finger}
                </text>
              )}
            </g>
          )
        })}

        {/* Barre indicators */}
        {chord.barres.map((barreFret) => {
          const displayFret = barreFret - chord.startFret + 1
          const barreStrings = chord.strings
            .map((fret, i) => (fret !== null && fret >= barreFret ? i : -1))
            .filter((i) => i >= 0)

          if (barreStrings.length < 2) return null

          const firstString = barreStrings[0]
          const lastString = barreStrings[barreStrings.length - 1]

          if (firstString === undefined || lastString === undefined) return null

          const x1 = getStringX(firstString, layout.stringSpacing)
          const x2 = getStringX(lastString, layout.stringSpacing)
          const y = getFretY(displayFret - 0.5, layout.fretSpacing)

          return (
            <line
              key={`barre-${barreFret}`}
              x1={x1}
              y1={y}
              x2={x2}
              y2={y}
              stroke="currentColor"
              strokeWidth={dims.dotRadius * 1.8}
              strokeLinecap="round"
              opacity={0.8}
            />
          )
        })}
      </svg>
    </div>
  )
}
