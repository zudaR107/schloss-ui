import type { ButtonHTMLAttributes, CSSProperties } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

const VARIANT_STYLES: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background: 'var(--accent)',
    color: 'var(--text-inverted)',
    border: 'none',
  },
  secondary: {
    background: 'var(--accent-muted)',
    color: 'var(--accent)',
    border: 'none',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border)',
  },
  danger: {
    background: 'transparent',
    color: 'var(--danger)',
    border: '1px solid var(--danger)',
  },
}

export function Button({ variant = 'primary', style, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      {...rest}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        borderRadius: 8,
        padding: '0.5rem 0.9rem',
        fontWeight: 600,
        fontSize: '0.8125rem',
        lineHeight: '1.25rem',
        cursor: 'pointer',
        outline: 'none',
        textDecoration: 'none',
        ...VARIANT_STYLES[variant],
        ...style,
      }}
    />
  )
}
