import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { Sparkline } from './Sparkline'

afterEach(() => {
  cleanup()
})

describe('Sparkline', () => {
  it('renders one bar element per entry in values', () => {
    const { container } = render(<Sparkline values={[1, 5, 3]} />)

    expect(container.firstElementChild?.children.length).toBe(3)
  })

  it('renders without error and with zero bars for an empty array', () => {
    let container: HTMLElement
    expect(() => {
      ;({ container } = render(<Sparkline values={[]} />))
    }).not.toThrow()

    const bars = container!.firstElementChild?.children.length ?? 0
    expect(bars).toBe(0)
  })

  it('renders exactly one bar for a single value', () => {
    const { container } = render(<Sparkline values={[7]} />)

    expect(container.firstElementChild?.children.length).toBe(1)
  })

  it('renders without error for negative values mixed with positive ones', () => {
    const { container } = render(<Sparkline values={[-3, 0, 5, -1]} />)

    expect(container.firstElementChild?.children.length).toBe(4)
  })

  it('is hidden from assistive technology', () => {
    const { container } = render(<Sparkline values={[1, 2, 3]} />)

    const root = container.firstElementChild
    const isAriaHidden = root?.getAttribute('aria-hidden') === 'true'
    const isRoleImg = root?.getAttribute('role') === 'img'

    expect(isAriaHidden || isRoleImg).toBe(true)
  })
})
