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

describe('SegmentedControl hover feedback', () => {
  it('changes the inactive option color on hover', async () => {
    const user = userEvent.setup()
    render(
      <SegmentedControl options={twoOptions} value="active" onChange={vi.fn()} />,
    )

    const inactiveButton = screen.getByRole('button', { name: 'Закрытые' })
    const originalColor = inactiveButton.style.color

    await user.hover(inactiveButton)
    expect(inactiveButton.style.color).not.toBe(originalColor)

    await user.unhover(inactiveButton)
    expect(inactiveButton.style.color).toBe(originalColor)
  })

  it('does not lose its active appearance when the active option is hovered', async () => {
    const user = userEvent.setup()
    render(
      <SegmentedControl options={twoOptions} value="active" onChange={vi.fn()} />,
    )

    const activeButton = screen.getByRole('button', { name: 'Активные' })
    const inactiveButton = screen.getByRole('button', { name: 'Закрытые' })

    expect(activeButton).toHaveAttribute('aria-pressed', 'true')

    await user.hover(activeButton)

    // Still marked as pressed/active from an a11y standpoint.
    expect(activeButton).toHaveAttribute('aria-pressed', 'true')
    // Still visually distinguished from the (un-hovered) inactive option -
    // hovering the active segment must not make it collapse into the same
    // look as an inactive one.
    expect(activeButton.style.background).not.toBe(inactiveButton.style.background)

    await user.unhover(activeButton)
    expect(activeButton).toHaveAttribute('aria-pressed', 'true')
  })
})
