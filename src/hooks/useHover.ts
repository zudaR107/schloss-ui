import { useState, type MouseEventHandler } from 'react'

interface UseHoverResult {
  hovered: boolean
  onMouseEnter: MouseEventHandler
  onMouseLeave: MouseEventHandler
}

// Internal - not exported from the package. Inline `style` objects can't
// express `:hover`, so any component that needs hover feedback tracks it
// as state instead.
export function useHover(): UseHoverResult {
  const [hovered, setHovered] = useState(false)
  return {
    hovered,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  }
}
