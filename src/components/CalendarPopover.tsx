import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { createPortal } from 'react-dom'

// Internal - not exported from the package.

interface CalendarPopoverProps {
  open: boolean
  onClose: () => void
  anchorRef: RefObject<HTMLElement | null>
  children: ReactNode
}

export function CalendarPopover({ open, onClose, anchorRef, children }: CalendarPopoverProps) {
  const popoverRef = useRef<HTMLDivElement | null>(null)
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)
  // Guards the below-viewport correction pass (see the second effect) so
  // it only ever nudges the position once per open - without this, each
  // correction would trigger the effect again via the `position` state
  // change it causes, forever re-measuring.
  const correctedRef = useRef(false)

  // Pass 1: always open directly below the trigger. This is right the
  // overwhelming majority of the time and, critically, never moves the
  // popover somewhere visually disconnected from the field it belongs to
  // - unlike guessing a fixed popover height up front and deciding to
  // flip above based on that guess, which (as seen in practice) can flip
  // the calendar far from the trigger whenever the guess is off.
  useLayoutEffect(() => {
    correctedRef.current = false
    if (!open) {
      setPosition(null)
      return
    }
    const rect = anchorRef.current?.getBoundingClientRect()
    if (!rect) return
    setPosition({ top: rect.bottom + 4, left: rect.left })
  }, [open, anchorRef])

  // Pass 2: now that the popover is actually in the DOM, measure its
  // real height. Only correct if it would genuinely overflow past the
  // bottom of the viewport, and only by the minimum amount needed to
  // bring it fully on-screen - it stays visually anchored just above/
  // below the trigger rather than jumping to some other part of the page.
  useLayoutEffect(() => {
    if (!position || !popoverRef.current || correctedRef.current) return
    const overflow = popoverRef.current.getBoundingClientRect().bottom - window.innerHeight
    if (overflow > 0) {
      correctedRef.current = true
      setPosition((p) => (p ? { ...p, top: Math.max(8, p.top - overflow - 8) } : p))
    }
  }, [position])

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
