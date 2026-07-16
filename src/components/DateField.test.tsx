import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DateField } from './DateField'

afterEach(() => {
  cleanup()
})

describe('DateField', () => {
  it('renders a labelled trigger field findable via getByLabelText', () => {
    render(<DateField label="Дата" value="" onChange={vi.fn()} />)
    const trigger = screen.getByLabelText('Дата')
    expect(trigger).toBeInTheDocument()
  })

  it('shows a formatted dd.mm.yyyy display of a set value', () => {
    render(<DateField label="Дата" value="2026-07-15" onChange={vi.fn()} />)
    expect(screen.getByLabelText('Дата')).toHaveValue('15.07.2026')
  })

  it('shows an empty/placeholder display when value is ""', () => {
    render(<DateField label="Дата" value="" onChange={vi.fn()} />)
    expect(screen.getByLabelText('Дата')).toHaveValue('')
  })

  it('does not render a calendar popover before the trigger is clicked', () => {
    render(<DateField label="Дата" value="2026-07-15" onChange={vi.fn()} />)
    expect(screen.queryByLabelText('2026-07-15')).not.toBeInTheDocument()
  })

  it('opens a calendar popover on click, with the day matching the set value queryable by aria-label', async () => {
    const user = userEvent.setup()
    render(<DateField label="Дата" value="2026-07-15" onChange={vi.fn()} />)

    const trigger = screen.getByLabelText('Дата')
    await user.click(trigger)

    const dayButton = screen.getByRole('button', { name: '2026-07-15' })
    expect(dayButton).toBeInTheDocument()
  })

  it('calls onChange with the clicked day\'s ISO string and closes the popover', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DateField label="Дата" value="2026-07-15" onChange={onChange} />)

    await user.click(screen.getByLabelText('Дата'))
    const dayButton = screen.getByRole('button', { name: '2026-07-20' })
    await user.click(dayButton)

    expect(onChange).toHaveBeenCalledWith('2026-07-20')
    expect(
      screen.queryByRole('button', { name: '2026-07-20' }),
    ).not.toBeInTheDocument()
  })

  it('shows the current month (containing the given value) when value is set to an earlier month', async () => {
    const user = userEvent.setup()
    render(<DateField label="Дата" value="2026-01-10" onChange={vi.fn()} />)

    await user.click(screen.getByLabelText('Дата'))

    expect(screen.getByRole('button', { name: '2026-01-10' })).toBeInTheDocument()
    // A date from a different month/year should not appear.
    expect(
      screen.queryByRole('button', { name: '2026-07-10' }),
    ).not.toBeInTheDocument()
  })
})
