import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { createPortal } from 'react-dom'

// Internal - not exported from the package.

// No real measurement pass - just enough to decide "does it fit below".
// Simpler and loop-free compared to measuring the actual rendered
// popover and repositioning, at the cost of a rare few px of slack.
const ESTIMATED_POPOVER_HEIGHT = 340

interface CalendarPopoverProps {
  open: boolean
  onClose: () => void
  anchorRef: RefObject<HTMLElement | null>
  children: ReactNode
}

export function CalendarPopover({ open, onClose, anchorRef, children }: CalendarPopoverProps) {
  const popoverRef = useRef<HTMLDivElement | null>(null)
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)

  useLayoutEffect(() => {
    if (!open) {
      setPosition(null)
      return
    }
    const rect = anchorRef.current?.getBoundingClientRect()
    if (!rect) return
    const fitsBelow = rect.bottom + 4 + ESTIMATED_POPOVER_HEIGHT <= window.innerHeight
    setPosition({
      top: fitsBelow ? rect.bottom + 4 : Math.max(8, rect.top - ESTIMATED_POPOVER_HEIGHT - 4),
      left: rect.left,
    })
  }, [open, anchorRef])

  useEffect(() => {
    if (!open) return

    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node
      if (popoverRef.current?.contains(target)) return
      if (anchorRef.current?.contains(target)) return
      onClose()
    }

    // Modal (schloss-ui/src/components/Modal.tsx) attaches its own
    // document-level bubble-phase keydown listener that closes the whole
    // form on Escape. A bubble-phase listener here would lose that race
    // (Modal's is already attached by the time this popover opens) -
    // Escape would close the entire form instead of just this popover.
    // Capture phase always runs first regardless of attachment order;
    // stopPropagation() there keeps the event from ever reaching Modal's
    // bubble-phase listener.
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Escape') return
      e.stopPropagation()
      onClose()
    }

    // scroll doesn't bubble, but a capture-phase window listener still
    // sees it on the way down to whatever nested element actually
    // scrolled (e.g. Modal's own overflow:auto content box).
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown, true)
    window.addEventListener('resize', onClose)
    window.addEventListener('scroll', onClose, true)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown, true)
      window.removeEventListener('resize', onClose)
      window.removeEventListener('scroll', onClose, true)
    }
  }, [open, onClose, anchorRef])

  if (!open || !position) return null

  return createPortal(
    <div
      ref={popoverRef}
      role="dialog"
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        // Above Modal's zIndex:100 and Toast's zIndex:200 - this popover
        // is the actively-focused control while open, so it should never
        // end up obscured by either.
        zIndex: 300,
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      {children}
    </div>,
    document.body,
  )
}
