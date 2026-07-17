import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from './ThemeToggle'
import type { Theme } from '../lib/theme'

const OPTION_LABELS = ['Светлая', 'Тёмная', 'OLED', 'Сепия']

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  cleanup()
})

describe('ThemeToggle (default trigger)', () => {
  it('renders a button with aria-label "Сменить тему" and no menu content visible initially', () => {
    render(<ThemeToggle />)

    expect(
      screen.getByRole('button', { name: 'Сменить тему' }),
    ).toBeInTheDocument()

    for (const label of OPTION_LABELS) {
      expect(screen.queryByText(label)).not.toBeInTheDocument()
    }
  })

  it('opens a menu with exactly 4 options in order when the trigger is clicked', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)

    await user.click(screen.getByRole('button', { name: 'Сменить тему' }))

    const optionButtons = OPTION_LABELS.map((label) =>
      screen.getByRole('button', { name: label }),
    )
    for (const button of optionButtons) {
      expect(button).toBeInTheDocument()
    }

    // Confirm order matches spec order: Светлая, Тёмная, OLED, Сепия.
    const allButtons = Array.from(document.querySelectorAll<HTMLElement>('button'))
    const positions = optionButtons.map((button) => allButtons.indexOf(button))
    expect(positions).toEqual([...positions].sort((a, b) => a - b))
  })

  it('closes the menu when the trigger is clicked again while open', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)

    const trigger = screen.getByRole('button', { name: 'Сменить тему' })
    await user.click(trigger)
    expect(screen.getByText('Светлая')).toBeInTheDocument()

    await user.click(trigger)
    for (const label of OPTION_LABELS) {
      expect(screen.queryByText(label)).not.toBeInTheDocument()
    }
  })

  it('selecting a theme closes the menu and applies it via the real theme lib', async () => {
    const user = userEvent.setup()
    localStorage.setItem('schloss-theme', 'light')
    render(<ThemeToggle />)

    await user.click(screen.getByRole('button', { name: 'Сменить тему' }))
    await user.click(screen.getByRole('button', { name: 'Тёмная' }))

    for (const label of OPTION_LABELS) {
      expect(screen.queryByText(label)).not.toBeInTheDocument()
    }
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    expect(localStorage.getItem('schloss-theme')).toBe('dark')

    // Trigger can be re-opened afterwards, still with 4 options.
    await user.click(screen.getByRole('button', { name: 'Сменить тему' }))
    for (const label of OPTION_LABELS) {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument()
    }
  })

  it('selecting the already-active theme is idempotent and does not throw', async () => {
    const user = userEvent.setup()
    localStorage.setItem('schloss-theme', 'oled')
    render(<ThemeToggle />)

    await user.click(screen.getByRole('button', { name: 'Сменить тему' }))
    await expect(
      user.click(screen.getByRole('button', { name: 'OLED' })),
    ).resolves.not.toThrow()

    expect(document.documentElement.getAttribute('data-theme')).toBe('oled')
    expect(localStorage.getItem('schloss-theme')).toBe('oled')
    for (const label of OPTION_LABELS) {
      expect(screen.queryByText(label)).not.toBeInTheDocument()
    }
  })

  it('closes the menu when clicking outside, without changing the current theme', async () => {
    const user = userEvent.setup()
    localStorage.setItem('schloss-theme', 'sepia')
    const { container } = render(
      <div>
        <ThemeToggle />
        <button type="button" data-testid="outside">
          outside
        </button>
      </div>,
    )

    await user.click(screen.getByRole('button', { name: 'Сменить тему' }))
    expect(screen.getByText('Светлая')).toBeInTheDocument()

    // While open, the component renders a full-viewport fixed backdrop
    // behind the menu panel specifically to catch "click outside" (jsdom
    // does no real hit-testing/z-index layering, so a click fired at an
    // arbitrary sibling element doesn't reach it the way a real browser
    // click would - the backdrop itself must be the event target).
    const backdrop = container.querySelector<HTMLElement>(
      'div[style*="position: fixed"]',
    )
    if (!backdrop) throw new Error('outside-click backdrop not found')
    fireEvent.click(backdrop)

    for (const label of OPTION_LABELS) {
      expect(screen.queryByText(label)).not.toBeInTheDocument()
    }
    // Theme unchanged by the outside click (applyTheme was never called for
    // this render, so data-theme reflects whatever was there before - not
    // necessarily 'sepia' unless something applied it; the key assertion is
    // localStorage is untouched).
    expect(localStorage.getItem('schloss-theme')).toBe('sepia')
  })
})

describe('ThemeToggle (custom trigger)', () => {
  it('does not render the default trigger button when a custom trigger is provided', () => {
    render(
      <ThemeToggle
        trigger={({ onClick }) => (
          <button onClick={onClick} aria-label="MY-CUSTOM-TRIGGER">
            custom
          </button>
        )}
      />,
    )

    expect(
      screen.queryByRole('button', { name: 'Сменить тему' }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'MY-CUSTOM-TRIGGER' }),
    ).toBeInTheDocument()
  })

  it('passes the current theme (from getStoredTheme) to the trigger render prop', () => {
    localStorage.setItem('schloss-theme', 'sepia')
    let receivedTheme: Theme | undefined

    render(
      <ThemeToggle
        trigger={({ theme, onClick }) => {
          receivedTheme = theme
          return (
            <button onClick={onClick} aria-label="MY-CUSTOM-TRIGGER">
              custom
            </button>
          )
        }}
      />,
    )

    expect(receivedTheme).toBe('sepia')
  })

  it('opens the same 4-option dropdown when the custom trigger is clicked', async () => {
    const user = userEvent.setup()
    render(
      <ThemeToggle
        trigger={({ onClick }) => (
          <button onClick={onClick} aria-label="MY-CUSTOM-TRIGGER">
            custom
          </button>
        )}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'MY-CUSTOM-TRIGGER' }))

    for (const label of OPTION_LABELS) {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument()
    }
  })

  it('selecting an option from the custom-trigger dropdown applies the theme and closes it', async () => {
    const user = userEvent.setup()
    localStorage.setItem('schloss-theme', 'light')
    render(
      <ThemeToggle
        trigger={({ onClick }) => (
          <button onClick={onClick} aria-label="MY-CUSTOM-TRIGGER">
            custom
          </button>
        )}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'MY-CUSTOM-TRIGGER' }))
    await user.click(screen.getByRole('button', { name: 'Сепия' }))

    expect(document.documentElement.getAttribute('data-theme')).toBe('sepia')
    expect(localStorage.getItem('schloss-theme')).toBe('sepia')
    for (const label of OPTION_LABELS) {
      expect(screen.queryByText(label)).not.toBeInTheDocument()
    }
  })
})

describe('ThemeToggle (align prop)', () => {
  it('renders, opens, and allows selection without breaking when align="left"', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle align="left" />)

    await user.click(screen.getByRole('button', { name: 'Сменить тему' }))
    await user.click(screen.getByRole('button', { name: 'Светлая' }))

    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    expect(localStorage.getItem('schloss-theme')).toBe('light')
  })
})
