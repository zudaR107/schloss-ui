export interface SparklineProps {
  values: number[]
  height?: number
}

export function Sparkline({ values, height = 24 }: SparklineProps) {
  if (values.length === 0) return null

  const max = Math.max(...values)
  const min = Math.min(...values, 0)
  const range = max - min || 1

  return (
    <div
      role="img"
      aria-hidden="true"
      style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height }}
    >
      {values.map((value, index) => {
        const percent = ((value - min) / range) * 100
        return (
          <div
            key={index}
            style={{
              flex: 1,
              height: `${Math.max(percent, 4)}%`,
              background: 'var(--accent)',
              borderRadius: 1,
            }}
          />
        )
      })}
    </div>
  )
}
