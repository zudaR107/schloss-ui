import { useLayoutEffect, useRef, type ChangeEvent, type FocusEvent } from 'react'
import { Field, type FieldInputProps } from './Field'
import { formatGroupedNumber, parseGroupedNumber } from '../lib/numberFormat'

export interface NumberFieldProps extends Omit<FieldInputProps, 'type' | 'value' | 'onChange' | 'as'> {
  /** Raw, unformatted numeric string ('', '0', '150000.5', '-200', ...). */
  value: string
  onChange: (raw: string) => void
}

// Allows a partial in-progress edit ('', '-', '12.', ...), not just a
// fully-valid number - rejecting those would make it impossible to type
// "-" before the first digit or "." before the decimal digits.
const VALID_PARTIAL = /^-?\d*\.?\d*$/

function countDigits(s: string): number {
  let n = 0
  for (const ch of s) if (ch >= '0' && ch <= '9') n++
  return n
}

/** Position right after the Nth digit in `formatted` (grouping spaces
 * don't count) - the inverse of countDigits, used to re-anchor the caret
 * after reformatting changes the string length. */
function caretAfterDigit(formatted: string, digitCount: number): number {
  if (digitCount <= 0) return 0
  let seen = 0
  for (let i = 0; i < formatted.length; i++) {
    if (formatted[i] >= '0' && formatted[i] <= '9') {
      seen++
      if (seen === digitCount) return i + 1
    }
  }
  return formatted.length
}

/**
 * A Field that displays/accepts thousand-space-grouped numbers
 * ("150 000") while keeping the caller's state as a plain unformatted
 * string. Selects existing "0" on focus so the very first keystroke
 * replaces the placeholder default instead of prepending to it.
 */
export function NumberField({ value, onChange, onFocus, style, ...rest }: NumberFieldProps) {
  // Field renders a single <input> inside a wrapper div; grabbing it via
  // this container (rather than needing Field itself to forward a ref)
  // keeps Field.tsx untouched.
  const containerRef = useRef<HTMLDivElement | null>(null)
  const pendingCaret = useRef<number | null>(null)

  useLayoutEffect(() => {
    if (pendingCaret.current === null) return
    const input = containerRef.current?.querySelector('input')
    input?.setSelectionRange(pendingCaret.current, pendingCaret.current)
    pendingCaret.current = null
  })

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const displayed = e.target.value
    const caretPos = e.target.selectionStart ?? displayed.length
    const digitsBeforeCaret = countDigits(displayed.slice(0, caretPos))

    const cleaned = parseGroupedNumber(displayed)
    if (!VALID_PARTIAL.test(cleaned)) return // reject the keystroke, keep previous state

    pendingCaret.current = caretAfterDigit(formatGroupedNumber(cleaned), digitsBeforeCaret)
    onChange(cleaned)
  }

  function handleFocus(e: FocusEvent<HTMLInputElement>) {
    if (value === '0') e.target.select()
    onFocus?.(e)
  }

  return (
    <div ref={containerRef}>
      <Field
        {...rest}
        type="text"
        inputMode="decimal"
        value={formatGroupedNumber(value)}
        onChange={handleChange}
        onFocus={handleFocus}
        style={style}
      />
    </div>
  )
}
