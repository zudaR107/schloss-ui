import type { ReactNode } from 'react'

export interface AmountDelta {
  /** Percentage magnitude, e.g. 12.4 for "▲ 12.4%". Sign is conveyed by `direction`, not this value. */
  value: number
  direction: 'up' | 'down'
}

export interface AmountProps {
  /** The signed numeric value - used only to pick the color/prefix, not formatted directly. */
  value: number
  /** The already-formatted absolute-value magnitude (currency/locale-formatted, no sign), e.g. "1 234 ₽". */
  children: ReactNode
  delta?: AmountDelta
}

export function Amount({ value, children, delta }: AmountProps) {
  const color = value > 0 ? 'var(--success)' : value < 0 ? 'var(--danger)' : 'var(--text-primary)'
  const prefix = value > 0 ? '+' : value < 0 ? '−' : ''

  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: '0.35rem' }}>
      <span style={{ fontVariantNumeric: 'tabular-nums', color }}>
        {prefix}
        {children}
      </span>
      {delta && (
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            fontVariantNumeric: 'tabular-nums',
            color: delta.direction === 'up' ? 'var(--success)' : 'var(--danger)',
          }}
        >
          {delta.direction === 'up' ? '▲' : '▼'} {Math.abs(delta.value)}%
        </span>
      )}
    </span>
  )
}
