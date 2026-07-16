import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { handleArrowFieldNavigation } from './formNavigation'

afterEach(() => {
  cleanup()
})

function Harness() {
  return (
    <form onKeyDown={handleArrowFieldNavigation}>
      <input aria-label="Поле 1" />
      <input aria-label="Поле 2 (отключено)" disabled />
      <select aria-label="Поле 3">
        <option value="a">A</option>
      </select>
      <textarea aria-label="Поле 4" />
      <button type="button">Кнопка</button>
    </form>
  )
}

describe('handleArrowFieldNavigation', () => {
  it('moves focus to the next enabled field on ArrowDown, skipping a disabled field, and prevents default', () => {
    render(<Harness />)
    const field1 = screen.getByLabelText('Поле 1')
    const field3 = screen.getByLabelText('Поле 3')

    field1.focus()
    expect(field1).toHaveFocus()

    const notCancelled = fireEvent.keyDown(field1, { key: 'ArrowDown' })

    expect(field3).toHaveFocus()
    expect(notCancelled).toBe(false)
  })

  it('moves focus to the previous enabled field on ArrowUp, skipping a disabled field', () => {
    render(<Harness />)
    const field1 = screen.getByLabelText('Поле 1')
    const field3 = screen.getByLabelText('Поле 3')

    field3.focus()
    expect(field3).toHaveFocus()

    const notCancelled = fireEvent.keyDown(field3, { key: 'ArrowUp' })

    expect(field1).toHaveFocus()
    expect(notCancelled).toBe(false)
  })

  it('moves focus forward across all enabled fields in DOM order', () => {
    render(<Harness />)
    const field1 = screen.getByLabelText('Поле 1')
    const field3 = screen.getByLabelText('Поле 3')
    const field4 = screen.getByLabelText('Поле 4')

    field1.focus()
    fireEvent.keyDown(field1, { key: 'ArrowDown' })
    expect(field3).toHaveFocus()

    fireEvent.keyDown(field3, { key: 'ArrowDown' })
    expect(field4).toHaveFocus()
  })

  it('is a no-op with no wraparound when pressing ArrowDown on the last field', () => {
    render(<Harness />)
    const field4 = screen.getByLabelText('Поле 4')

    field4.focus()
    fireEvent.keyDown(field4, { key: 'ArrowDown' })

    expect(field4).toHaveFocus()
  })

  it('is a no-op with no wraparound when pressing ArrowUp on the first field', () => {
    render(<Harness />)
    const field1 = screen.getByLabelText('Поле 1')

    field1.focus()
    fireEvent.keyDown(field1, { key: 'ArrowUp' })

    expect(field1).toHaveFocus()
  })

  it('is a complete no-op for a non-arrow key: no preventDefault, no focus movement', () => {
    render(<Harness />)
    const field1 = screen.getByLabelText('Поле 1')
    const field3 = screen.getByLabelText('Поле 3')

    field1.focus()
    const notCancelled = fireEvent.keyDown(field1, { key: 'a' })

    expect(field1).toHaveFocus()
    expect(field3).not.toHaveFocus()
    expect(notCancelled).toBe(true)
  })

  it('is a no-op for Enter and Tab keys', () => {
    render(<Harness />)
    const field1 = screen.getByLabelText('Поле 1')

    field1.focus()
    fireEvent.keyDown(field1, { key: 'Enter' })
    expect(field1).toHaveFocus()

    fireEvent.keyDown(field1, { key: 'Tab' })
    expect(field1).toHaveFocus()
  })

  it('does not move focus when the focused target is not an input/select/textarea', () => {
    render(<Harness />)
    const button = screen.getByRole('button', { name: 'Кнопка' })
    const field1 = screen.getByLabelText('Поле 1')

    button.focus()
    fireEvent.keyDown(button, { key: 'ArrowDown' })

    expect(button).toHaveFocus()
    expect(field1).not.toHaveFocus()
  })
})
