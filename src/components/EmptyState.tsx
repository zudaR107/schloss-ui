import type { ReactNode } from 'react'

export interface EmptyStateProps {
  /** A line icon (e.g. a lucide-react component instance) - not an emoji. */
  icon: ReactNode
  title: string
  /** One short sentence. */
  description: string
  actionLabel: string
  onAction: () => void
  /** Optional icon rendered before the action button's label. */
  actionIcon?: ReactNode
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
}: EmptyStateProps) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: 440, margin: '0 auto' }}>
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: 'var(--accent-muted)',
          color: 'var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
        }}
      >
        {icon}
      </div>
      <h2
        style={{
          margin: '0 0 0.5rem',
          color: 'var(--text-primary)',
          fontSize: '1.125rem',
          fontWeight: 600,
        }}
      >
        {title}
      </h2>
      <p style={{ margin: '0 0 1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        {description}
      </p>
      <button
        type="button"
        onClick={onAction}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'var(--accent)',
          color: 'var(--text-inverted)',
          borderRadius: 'var(--radius-md)',
          padding: '0.5rem 1rem',
          fontWeight: 500,
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
          cursor: 'pointer',
          border: 'none',
          outline: 'none',
        }}
      >
        {actionIcon}
        {actionLabel}
      </button>
    </div>
  )
}
