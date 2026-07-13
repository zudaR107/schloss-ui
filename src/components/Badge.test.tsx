import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { Badge, type BadgeVariant } from './Badge'

afterEach(() => {
  cleanup()
})

const variants: BadgeVariant[] = [
  'success',
  'danger',
  'info',
  'warning',
  'neutral',
]

describe('Badge', () => {
  it.each(variants)('renders its children for variant="%s"', (variant) => {
    render(<Badge variant={variant}>Label {variant}</Badge>)
    expect(screen.getByText(`Label ${variant}`)).toBeInTheDocument()
  })

  it('renders only the children content when dot is not provided', () => {
    const { container } = render(<Badge variant="info">Только текст</Badge>)
    expect(container.textContent?.trim()).toBe('Только текст')
  })

  it('renders only the children content when dot is explicitly false', () => {
    const { container } = render(
      <Badge variant="info" dot={false}>
        Только текст
      </Badge>,
    )
    expect(container.textContent?.trim()).toBe('Только текст')
  })

  it('renders an additional element when dot is true', () => {
    const { container: withoutDot } = render(
      <Badge variant="success">Готово</Badge>,
    )
    const withoutDotCount = withoutDot.querySelectorAll('*').length
    cleanup()

    const { container: withDot } = render(
      <Badge variant="success" dot>
        Готово
      </Badge>,
    )
    const withDotCount = withDot.querySelectorAll('*').length

    expect(withDotCount).toBeGreaterThan(withoutDotCount)
  })
})
