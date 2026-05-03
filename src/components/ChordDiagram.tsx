import type { Chord } from '../types/chord'
import { getFingerColor } from '../data/fingerColors'
import {
  SIZES,
  STRING_COUNT,
  FRET_COUNT,
  PADDING_TOP,
  PADDING_LEFT,
  calculateLayout,
  getStringX,
  getFretY,
  getBarreStringSet,
  findBarreFinger,
} from './chordDiagramLayout'
import type { DiagramSize } from './chordDiagramLayout'

interface ChordDiagramProps {
  chord: Chord
  size?: DiagramSize
}

export function ChordDiagram({ chord, size = 'md' }: ChordDiagramProps) {
  const dims = SIZES[size]
  const layout = calculateLayout(dims.width, dims.height)
  const showNut = chord.startFret <= 1
  const barreStringSet = getBarreStringSet(chord)

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
              <text key={`marker-${i}`} x={x} y={y} textAnchor="middle"
                fontSize={dims.markerSize} fill="currentColor">X</text>
            )
          }
          if (fret === 0) {
            return (
              <text key={`marker-${i}`} x={x} y={y} textAnchor="middle"
                fontSize={dims.markerSize} fill="currentColor">O</text>
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

        {/* Finger dots (skip strings that are part of a barre) */}
        {chord.strings.map((fret, i) => {
          if (fret === null || fret === 0) return null
          if (barreStringSet.has(i)) return null

          const displayFret = fret - chord.startFret + 1
          const x = getStringX(i, layout.stringSpacing)
          const y = getFretY(displayFret - 0.5, layout.fretSpacing)
          const finger = chord.fingers[i] ?? null

          return (
            <g key={`dot-${i}`}>
              <circle cx={x} cy={y} r={dims.dotRadius} fill={getFingerColor(finger)} />
              {finger !== null && (
                <text x={x} y={y + dims.dotRadius * 0.35} textAnchor="middle"
                  fontSize={dims.dotRadius * 1.2} fill="white" className="dark:fill-gray-900">
                  {finger}
                </text>
              )}
            </g>
          )
        })}

        {/* Barre indicators (rounded rectangles) */}
        {chord.barres.map((barreFret) => {
          const displayFret = barreFret - chord.startFret + 1
          const barreFinger = findBarreFinger(chord, barreFret)
          const barreStrings = chord.strings
            .map((fret, i) =>
              fret === barreFret && chord.fingers[i] === barreFinger ? i : -1
            )
            .filter((i) => i >= 0)

          if (barreStrings.length < 2) return null

          const firstString = barreStrings[0]
          const lastString = barreStrings[barreStrings.length - 1]
          if (firstString === undefined || lastString === undefined) return null

          const x1 = getStringX(firstString, layout.stringSpacing)
          const x2 = getStringX(lastString, layout.stringSpacing)
          const y = getFretY(displayFret - 0.5, layout.fretSpacing)
          const barreHeight = dims.dotRadius * 2
          const cornerRadius = dims.dotRadius

          return (
            <g key={`barre-${barreFret}`} data-testid={`barre-group-${barreFret}`}>
              <rect
                data-testid={`barre-${barreFret}`}
                x={x1 - dims.dotRadius}
                y={y - barreHeight / 2}
                width={x2 - x1 + dims.dotRadius * 2}
                height={barreHeight}
                rx={cornerRadius}
                ry={cornerRadius}
                fill={getFingerColor(barreFinger)}
              />
              {barreFinger !== null && (
                <text x={(x1 + x2) / 2} y={y + dims.dotRadius * 0.35} textAnchor="middle"
                  fontSize={dims.dotRadius * 1.2} fill="white" className="dark:fill-gray-900">
                  {barreFinger}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
