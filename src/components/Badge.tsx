import type { ReactNode } from 'react'

export type BadgeVariant = 'success' | 'danger' | 'info' | 'warning' | 'neutral'

export interface BadgeProps {
  variant: BadgeVariant
  children: ReactNode
  /** Leading dot indicator, for state badges (доход/расход/перевод) - omit for pure labels (Скоро, Закрыт). */
  dot?: boolean
}

const VARIANT_TOKENS: Record<BadgeVariant, { bg: string; text: string }> = {
  success: { bg: 'var(--badge-success-bg)', text: 'var(--badge-success-text)' },
  danger: { bg: 'var(--badge-danger-bg)', text: 'var(--badge-danger-text)' },
  info: { bg: 'var(--badge-info-bg)', text: 'var(--badge-info-text)' },
  warning: { bg: 'var(--badge-warning-bg)', text: 'var(--badge-warning-text)' },
  neutral: { bg: 'var(--border)', text: 'var(--text-secondary)' },
}

export function Badge({ variant, children, dot = false }: BadgeProps) {
  const { bg, text } = VARIANT_TOKENS[variant]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        background: bg,
        color: text,
        borderRadius: 6,
        padding: '0.2rem 0.5rem',
        fontSize: '0.6875rem',
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'currentColor',
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </span>
  )
}
