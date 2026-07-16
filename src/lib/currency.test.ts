import { describe, expect, it } from 'vitest'
import { currencySymbol } from './currency'

describe('currencySymbol', () => {
  it('returns the ruble sign for RUB', () => {
    expect(currencySymbol('RUB')).toBe('₽')
  })

  it('returns the dollar sign for USD', () => {
    expect(currencySymbol('USD')).toBe('$')
  })

  it('returns the euro sign for EUR', () => {
    expect(currencySymbol('EUR')).toBe('€')
  })

  it('falls back to returning the code unchanged for an invalid code, without throwing', () => {
    expect(() => currencySymbol('NOTREAL')).not.toThrow()
    expect(currencySymbol('NOTREAL')).toBe('NOTREAL')
  })
})
