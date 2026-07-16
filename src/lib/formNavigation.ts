import type { KeyboardEvent } from 'react'

type NavigableElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

function isNavigable(el: Element): el is NavigableElement {
  return (
    (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) &&
    !el.hasAttribute('disabled') &&
    el.tabIndex !== -1
  )
}

/**
 * Attach to a <form>'s onKeyDown. ArrowUp/ArrowDown move focus to the
 * previous/next field in DOM order instead of the browser's native
 * per-element behavior (number-input spinner, <select> option cycling) -
 * a no-op for every other key, so it's safe to attach unconditionally.
 */
export function handleArrowFieldNavigation(e: KeyboardEvent<HTMLFormElement>): void {
  if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return
  if (!isNavigable(e.target as Element)) return

  const focusable = Array.from(e.currentTarget.elements).filter(isNavigable)
  const index = focusable.indexOf(e.target as NavigableElement)
  if (index === -1) return

  const next = focusable[e.key === 'ArrowDown' ? index + 1 : index - 1]
  if (!next) return

  e.preventDefault()
  next.focus()
}
