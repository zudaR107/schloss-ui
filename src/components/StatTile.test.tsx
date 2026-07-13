import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { StatTile } from './StatTile'

afterEach(() => {
  cleanup()
})

describe('StatTile', () => {
  it('renders the label and value text when both are simple strings', () => {
    render(<StatTile label="Баланс" value="1 234 ₽" />)

    expect(screen.getByText('Баланс')).toBeInTheDocument()
    expect(screen.getByText('1 234 ₽')).toBeInTheDocument()
  })

  it('renders nested content when value is a ReactNode', () => {
    render(
      <StatTile
        label="Счётчик"
        value={<span data-testid="custom-value">42</span>}
      />,
    )

    const custom = screen.getByTestId('custom-value')
    expect(custom).toBeInTheDocument()
    expect(custom).toHaveTextContent('42')
  })

  it('renders without error when accent is omitted', () => {
    expect(() =>
      render(<StatTile label="Label" value="Value" />),
    ).not.toThrow()
    expect(screen.getByText('Label')).toBeInTheDocument()
    expect(screen.getByText('Value')).toBeInTheDocument()
  })

  it('renders without error when accent is explicitly false', () => {
    expect(() =>
      render(<StatTile label="Label" value="Value" accent={false} />),
    ).not.toThrow()
    expect(screen.getByText('Label')).toBeInTheDocument()
    expect(screen.getByText('Value')).toBeInTheDocument()
  })

  it('renders without error when accent is true', () => {
    expect(() =>
      render(<StatTile label="Label" value="Value" accent />),
    ).not.toThrow()
    expect(screen.getByText('Label')).toBeInTheDocument()
    expect(screen.getByText('Value')).toBeInTheDocument()
  })
})
