// U+00A0 non-breaking space - standard for thousand-grouping in Russian
// typography, visually identical to a regular space but never causes an
// awkward mid-number line break.
const GROUPING_SPACE = ' '

/** Strips grouping separators (regular or non-breaking space) and
 * normalizes a "," decimal (common on Russian keyboards) to "." - the
 * reverse of formatGroupedNumber. */
export function parseGroupedNumber(display: string): string {
  return display.replace(/[ \s]/g, '').replace(',', '.')
}

/** "150000.5" -> "150 000.5" (integer part grouped in triples, decimal
 * part left untouched). Sign-aware. No-op on '' or a bare "-"/".". */
export function formatGroupedNumber(raw: string): string {
  if (!raw) return raw
  const negative = raw.startsWith('-')
  const unsigned = negative ? raw.slice(1) : raw
  const [intPart, ...rest] = unsigned.split('.')
  const decimalSuffix = rest.length > 0 ? '.' + rest.join('') : ''
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, GROUPING_SPACE)
  return (negative ? '-' : '') + grouped + decimalSuffix
}
