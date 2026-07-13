import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, render, screen } from '@testing-library/react'
import { Toast } from './Toast'

afterEach(() => {
  cleanup()
})

describe('Toast', () => {
  it('renders nothing when open is false', () => {
    render(
      <Toast
        open={false}
        variant="success"
        message="Счёт сохранён"
        onDismiss={vi.fn()}
      />,
    )

    expect(screen.queryByText('Счёт сохранён')).not.toBeInTheDocument()
  })

  it('renders the message when open is true', () => {
    render(
      <Toast
        open
        variant="success"
        message="Счёт сохранён"
        onDismiss={vi.fn()}
      />,
    )

    expect(screen.getByText('Счёт сохранён')).toBeInTheDocument()
  })

  it('exposes an accessible live-region role', () => {
    render(
      <Toast
        open
        variant="success"
        message="Счёт сохранён"
        onDismiss={vi.fn()}
      />,
    )

    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('renders both success and error variants with the message visible', () => {
    const { rerender } = render(
      <Toast
        open
        variant="success"
        message="Счёт сохранён"
        onDismiss={vi.fn()}
      />,
    )
    expect(screen.getByText('Счёт сохранён')).toBeInTheDocument()

    rerender(
      <Toast
        open
        variant="error"
        message="Не удалось сохранить"
        onDismiss={vi.fn()}
      />,
    )
    expect(screen.getByText('Не удалось сохранить')).toBeInTheDocument()
  })

  describe('auto-dismiss timing', () => {
    afterEach(() => {
      vi.useRealTimers()
    })

    it('calls onDismiss exactly once after the default duration elapses', () => {
      vi.useFakeTimers()
      const onDismiss = vi.fn()
      render(
        <Toast
          open
          variant="success"
          message="Счёт сохранён"
          onDismiss={onDismiss}
        />,
      )

      act(() => {
        vi.advanceTimersByTime(3200)
      })

      expect(onDismiss).toHaveBeenCalledTimes(1)
    })

    it('respects a custom duration, not firing before it and firing at it', () => {
      vi.useFakeTimers()
      const onDismiss = vi.fn()
      render(
        <Toast
          open
          variant="success"
          message="Счёт сохранён"
          onDismiss={onDismiss}
          duration={1000}
        />,
      )

      act(() => {
        vi.advanceTimersByTime(999)
      })
      expect(onDismiss).not.toHaveBeenCalled()

      act(() => {
        vi.advanceTimersByTime(1)
      })
      expect(onDismiss).toHaveBeenCalledTimes(1)
    })

    it('never auto-dismisses when duration is 0', () => {
      vi.useFakeTimers()
      const onDismiss = vi.fn()
      render(
        <Toast
          open
          variant="success"
          message="Счёт сохранён"
          onDismiss={onDismiss}
          duration={0}
        />,
      )

      act(() => {
        vi.advanceTimersByTime(60000)
      })

      expect(onDismiss).not.toHaveBeenCalled()
    })

    it('cleans up the pending timer when closed before it fires, so onDismiss never fires afterward', () => {
      vi.useFakeTimers()
      const onDismiss = vi.fn()
      const { rerender } = render(
        <Toast
          open
          variant="success"
          message="Счёт сохранён"
          onDismiss={onDismiss}
        />,
      )

      act(() => {
        vi.advanceTimersByTime(1000)
      })

      rerender(
        <Toast
          open={false}
          variant="success"
          message="Счёт сохранён"
          onDismiss={onDismiss}
        />,
      )

      act(() => {
        vi.advanceTimersByTime(3000)
      })

      expect(onDismiss).not.toHaveBeenCalled()
    })
  })
})
