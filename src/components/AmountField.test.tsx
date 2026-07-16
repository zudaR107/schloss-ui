import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { AmountField } from './AmountField'

afterEach(() => {
  cleanup()
})

describe('AmountField', () => {
  it('renders a labelled text field findable via getByLabelText', () => {
    render(<AmountField label="Сумма" value="" onChange={vi.fn()} />)
    const input = screen.getByLabelText('Сумма')
    expect(input).toBeInTheDocument()
    expect(input.tagName).toBe('INPUT')
  })

  it('shows the ruble sign as the prefix when currencyCode is omitted', () => {
    render(<AmountField label="Сумма" value="" onChange={vi.fn()} />)
    expect(screen.getByText('₽')).toBeInTheDocument()
  })

  it('shows the dollar sign as the prefix when currencyCode="USD"', () => {
    render(
      <AmountField
        label="Сумма"
        value=""
        onChange={vi.fn()}
        currencyCode="USD"
      />,
    )
    expect(screen.getByText('$')).toBeInTheDocument()
  })

  it('shows the euro sign as the prefix when currencyCode="EUR"', () => {
    render(
      <AmountField
        label="Сумма"
        value=""
        onChange={vi.fn()}
        currencyCode="EUR"
      />,
    )
    expect(screen.getByText('€')).toBeInTheDocument()
  })

  it('displays the value thousand-grouped, same as NumberField', () => {
    render(<AmountField label="Сумма" value="150000" onChange={vi.fn()} />)
    expect(screen.getByLabelText('Сумма')).toHaveValue('150 000')
  })
})
