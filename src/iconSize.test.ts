import { describe, expect, it } from 'vitest'
import { ICON_SIZE } from './iconSize'

describe('ICON_SIZE', () => {
  it('exposes the four documented size steps', () => {
    expect(ICON_SIZE).toEqual({
      dense: 14,
      default: 16,
      emphasis: 20,
      illustrative: 28,
    })
  })
})
