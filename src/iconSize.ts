/**
 * lucide-react is the canonical icon set across the platform. Reference
 * these names instead of a magic pixel number - see README.md for the
 * full size/strokeWidth/color contract.
 */
export const ICON_SIZE = {
  /** Dense lists, inline with small text. */
  dense: 14,
  /** Nav items, buttons, form fields. */
  default: 16,
  /** Page headers, the shared Header component. */
  emphasis: 20,
  /** Empty states, illustrative badges. */
  illustrative: 28,
} as const

export type IconSizeName = keyof typeof ICON_SIZE
