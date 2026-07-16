import { afterEach, describe, expect, it, vi } from 'vitest'
import { useState } from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NumberField } from './NumberField'

afterEach(() => {
  cleanup()
})

const NBSP = '\u00A0'

function Controlled({
  initial = '',
  onChangeSpy,
}: {
  initial?: string
  onChangeSpy?: (raw: string) => void
}) {
  const [value, setValue] = useState(initial)
  return (
    <NumberField
      label="Сумма"
      value={value}
      onChange={(raw: string) => {
        onChangeSpy?.(raw)
        setValue(raw)
      }}
    />
  )
}

describe('NumberField', () => {
  it('renders a labelled text field findable via getByLabelText', () => {
    render(<NumberField label="Сумма" value="" onChange={vi.fn()} />)
    const input = screen.getByLabelText('Сумма')
    expect(input).toBeInTheDocument()
    expect(input.tagName).toBe('INPUT')
  })

  it('displays the value thousand-grouped', () => {
    render(<NumberField label="Сумма" value="150000" onChange={vi.fn()} />)
    expect(screen.getByLabelText('Сумма')).toHaveValue(`150${NBSP}000`)
  })

  it('calls onChange with the raw ungrouped numeric string as the user types', async () => {
    const user = userEvent.setup()
    const onChangeSpy = vi.fn()
    render(<Controlled onChangeSpy={onChangeSpy} />)

    const input = screen.getByLabelText('Сумма')
    await user.type(input, '150000')

    expect(onChangeSpy).toHaveBeenLastCalledWith('150000')
    expect(input).toHaveValue(`150${NBSP}000`)
  })

  it('rejects a non-digit, non ./,/- character: value unchanged and onChange not called for that keystroke', async () => {
    const user = userEvent.setup()
    const onChangeSpy = vi.fn()
    render(<Controlled initial="123" onChangeSpy={onChangeSpy} />)

    const input = screen.getByLabelText('Сумма')
    onChangeSpy.mockClear()
    await user.type(input, 'a')

    expect(onChangeSpy).not.toHaveBeenCalled()
    expect(input).toHaveValue('123')
  })

  it('selects the whole text on focus when the current value is exactly "0", so typing a digit replaces it', async () => {
    const user = userEvent.setup()
    render(<Controlled initial="0" />)

    const input = screen.getByLabelText('Сумма')
    await user.click(input)
    await user.keyboard('5')

    expect(input).toHaveValue('5')
  })

  it('typing digits after a decimal point inserts them after the point, not before it', async () => {
    const user = userEvent.setup()
    const onChangeSpy = vi.fn()
    render(<Controlled onChangeSpy={onChangeSpy} />)

    const input = screen.getByLabelText('Сумма')
    await user.type(input, '10.50')

    expect(onChangeSpy).toHaveBeenLastCalledWith('10.50')
    expect(input).toHaveValue('10.50')
  })
})
