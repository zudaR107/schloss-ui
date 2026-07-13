import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SegmentedControl } from './SegmentedControl'

afterEach(() => {
  cleanup()
})

const twoOptions = [
  { value: 'active', label: 'Активные' },
  { value: 'closed', label: 'Закрытые' },
]

const fourOptions = [
  { value: 'one', label: 'Один' },
  { value: 'two', label: 'Два' },
  { value: 'three', label: 'Три' },
  { value: 'four', label: 'Четыре' },
]

describe('SegmentedControl', () => {
  it('renders one button per option, showing each label text', () => {
    render(
      <SegmentedControl options={twoOptions} value="active" onChange={vi.fn()} />,
    )

    expect(screen.getByRole('button', { name: 'Активные' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Закрытые' })).toBeInTheDocument()
  })

  it('marks the button matching the current value as aria-pressed="true", and others as not pressed', () => {
    render(
      <SegmentedControl options={twoOptions} value="active" onChange={vi.fn()} />,
    )

    const activeButton = screen.getByRole('button', { name: 'Активные' })
    const closedButton = screen.getByRole('button', { name: 'Закрытые' })

    expect(activeButton).toHaveAttribute('aria-pressed', 'true')

    const closedPressed = closedButton.getAttribute('aria-pressed')
    expect(closedPressed === 'false' || closedPressed === null).toBe(true)
  })

  it('calls onChange exactly once with the plain value when a non-active option is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <SegmentedControl options={twoOptions} value="active" onChange={onChange} />,
    )

    await user.click(screen.getByRole('button', { name: 'Закрытые' }))

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith('closed')
  })

  it('calls onChange with the same value when the already-active option is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <SegmentedControl options={twoOptions} value="active" onChange={onChange} />,
    )

    await user.click(screen.getByRole('button', { name: 'Активные' }))

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith('active')
  })

  it('works correctly with 4 options, rendering all and marking the active one', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <SegmentedControl options={fourOptions} value="three" onChange={onChange} />,
    )

    for (const option of fourOptions) {
      expect(
        screen.getByRole('button', { name: option.label }),
      ).toBeInTheDocument()
    }

    expect(screen.getByRole('button', { name: 'Три' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )

    await user.click(screen.getByRole('button', { name: 'Четыре' }))
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith('four')
  })
})
