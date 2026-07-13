import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { Amount } from './Amount'

afterEach(() => {
  cleanup()
})

const MINUS_SIGN = '−' // U+2212 MINUS SIGN

describe('Amount', () => {
  it('prefixes the children with "+" when value is positive', () => {
    const { container } = render(<Amount value={500}>1 234 ₽</Amount>)

    expect(container.textContent).toContain('+1 234 ₽')
  })

  it('prefixes the children with the Unicode minus sign (U+2212) when value is negative', () => {
    const { container } = render(<Amount value={-500}>1 234 ₽</Amount>)

    expect(container.textContent).toContain(`${MINUS_SIGN}1 234 ₽`)
    // Explicitly rule out a plain ASCII hyphen-minus (U+002D) being used instead.
    expect(container.textContent).not.toContain('-1 234 ₽')
  })

  it('renders no prefix when value is exactly 0', () => {
    const { container } = render(<Amount value={0}>1 234 ₽</Amount>)

    expect(container.textContent?.trim()).toBe('1 234 ₽')
  })

  it('renders an upward indicator and the delta percentage when direction is "up"', () => {
    const { container } = render(
      <Amount value={500} delta={{ value: 12.4, direction: 'up' }}>
        1 234 ₽
      </Amount>,
    )

    expect(container.textContent).toContain('▲')
    expect(container.textContent).toContain('12.4')
    expect(container.textContent).toContain('%')
  })

  it('renders a downward indicator and the delta percentage when direction is "down"', () => {
    const { container } = render(
      <Amount value={-500} delta={{ value: 8.1, direction: 'down' }}>
        1 234 ₽
      </Amount>,
    )

    expect(container.textContent).toContain('▼')
    expect(container.textContent).toContain('8.1')
    expect(container.textContent).toContain('%')
  })

  it('renders no delta indicator text when delta is not provided', () => {
    const { container } = render(<Amount value={500}>1 234 ₽</Amount>)

    expect(container.textContent).not.toContain('▲')
    expect(container.textContent).not.toContain('▼')
    expect(container.textContent).not.toContain('%')
  })
})
