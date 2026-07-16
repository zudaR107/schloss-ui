import { describe, expect, it } from 'vitest'
import { formatGroupedNumber, parseGroupedNumber } from './numberFormat'

const NBSP = ' '

describe('formatGroupedNumber', () => {
  it('groups a 6-digit integer part in thousands using a non-breaking space', () => {
    expect(formatGroupedNumber('150000')).toBe(`150${NBSP}000`)
  })

  it('groups the integer part but leaves the decimal part untouched', () => {
    expect(formatGroupedNumber('150000.5')).toBe(`150${NBSP}000.5`)
  })

  it('leaves a short integer string as a no-op', () => {
    expect(formatGroupedNumber('0')).toBe('0')
  })

  it('leaves a short negative integer string as a no-op', () => {
    expect(formatGroupedNumber('-200')).toBe('-200')
  })

  it('groups a 7-digit integer part into two separators', () => {
    expect(formatGroupedNumber('1234567')).toBe(`1${NBSP}234${NBSP}567`)
  })

  it('returns an empty string unchanged', () => {
    expect(formatGroupedNumber('')).toBe('')
  })

  it('is sign-aware, keeping a leading minus outside the grouping', () => {
    expect(formatGroupedNumber('-1234567')).toBe(`-1${NBSP}234${NBSP}567`)
  })
})

describe('parseGroupedNumber', () => {
  it('strips non-breaking grouping spaces and keeps a dot decimal separator', () => {
    expect(parseGroupedNumber(`150${NBSP}000.5`)).toBe('150000.5')
  })

  it('strips regular grouping spaces and converts a comma decimal separator to a dot', () => {
    expect(parseGroupedNumber('150 000,5')).toBe('150000.5')
  })

  it('strips non-breaking grouping spaces and converts a comma decimal separator to a dot', () => {
    expect(parseGroupedNumber(`150${NBSP}000,5`)).toBe('150000.5')
  })

  it('round-trips a formatted value back to its raw form', () => {
    const raw = '1234567.89'
    expect(parseGroupedNumber(formatGroupedNumber(raw))).toBe(raw)
  })
})
