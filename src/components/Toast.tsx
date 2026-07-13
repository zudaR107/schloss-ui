import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle2, XCircle } from 'lucide-react'

export type ToastVariant = 'success' | 'error'

export interface ToastProps {
  open: boolean
  variant: ToastVariant
  message: string
  onDismiss: () => void
  /** Auto-dismiss delay in ms. Pass 0 to disable auto-dismiss. */
  duration?: number
}

const VARIANT_ICON = {
  success: CheckCircle2,
  error: XCircle,
} as const

const VARIANT_TOKENS = {
  success: { bg: 'var(--success-muted)', color: 'var(--success)' },
  error: { bg: 'var(--danger-muted)', color: 'var(--danger)' },
} as const

export function Toast({ open, variant, message, onDismiss, duration = 3200 }: ToastProps) {
  useEffect(() => {
    if (!open || duration === 0) return
    const timer = setTimeout(onDismiss, duration)
    return () => clearTimeout(timer)
  }, [open, duration, onDismiss])

  if (!open) return null

  const Icon = VARIANT_ICON[variant]
  const { bg, color } = VARIANT_TOKENS[variant]

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        gap: '0.625rem',
        maxWidth: 360,
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        padding: '0.75rem 1rem',
      }}
    >
      <div
        style={{
          width: 24,
          height: 24,
          flexShrink: 0,
          borderRadius: '50%',
          background: bg,
          color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={14} strokeWidth={2} />
      </div>
      <span style={{ fontSize: '0.8125rem', color: 'var(--text-primary)' }}>{message}</span>
    </div>,
    document.body,
  )
}
