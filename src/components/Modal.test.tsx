import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from './Modal'

afterEach(() => {
  cleanup()
})

describe('Modal', () => {
  it('renders nothing when open is false', () => {
    render(
      <Modal open={false} onClose={vi.fn()} title="Заголовок">
        Содержимое модалки
      </Modal>,
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByText('Заголовок')).not.toBeInTheDocument()
    expect(screen.queryByText('Содержимое модалки')).not.toBeInTheDocument()
  })

  it('renders the dialog with title and children when open is true', () => {
    render(
      <Modal open onClose={vi.fn()} title="Заголовок">
        Содержимое модалки
      </Modal>,
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Заголовок')).toBeInTheDocument()
    expect(screen.getByText('Содержимое модалки')).toBeInTheDocument()
  })

  it('renders a close control with accessible name "Закрыть" and calls onClose exactly once when clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose} title="Заголовок">
        Содержимое модалки
      </Modal>,
    )

    const closeButton = screen.getByRole('button', { name: 'Закрыть' })
    await user.click(closeButton)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when Escape is pressed while open', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose} title="Заголовок">
        Содержимое модалки
      </Modal>,
    )

    await user.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose when clicking on the title or children content', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose} title="Заголовок">
        Содержимое модалки
      </Modal>,
    )

    await user.click(screen.getByText('Заголовок'))
    await user.click(screen.getByText('Содержимое модалки'))

    expect(onClose).not.toHaveBeenCalled()
  })

  it('calls onClose when clicking the backdrop outside the dialog', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose} title="Заголовок">
        Содержимое модалки
      </Modal>,
    )

    const dialog = screen.getByRole('dialog')
    const backdrop = dialog.parentElement
    expect(backdrop).not.toBeNull()
    expect(backdrop).not.toBe(dialog)

    await user.click(backdrop as HTMLElement)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('renders the icon in the header area alongside the title', () => {
    render(
      <Modal
        open
        onClose={vi.fn()}
        title="Заголовок"
        icon={<span data-testid="modal-icon">ICON</span>}
      >
        Содержимое модалки
      </Modal>,
    )

    expect(screen.getByTestId('modal-icon')).toBeInTheDocument()
  })

  it('renders action buttons and calls only the clicked action callback, not the other action or onClose', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const onCancel = vi.fn()
    const onSave = vi.fn()
    render(
      <Modal
        open
        onClose={onClose}
        title="Заголовок"
        actions={[
          { label: 'Отмена', onClick: onCancel },
          { label: 'Сохранить', onClick: onSave, variant: 'primary' },
        ]}
      >
        Содержимое модалки
      </Modal>,
    )

    const cancelButton = screen.getByRole('button', { name: 'Отмена' })
    const saveButton = screen.getByRole('button', { name: 'Сохранить' })
    expect(cancelButton).toBeInTheDocument()
    expect(saveButton).toBeInTheDocument()

    await user.click(cancelButton)

    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onSave).not.toHaveBeenCalled()
    expect(onClose).not.toHaveBeenCalled()

    await user.click(saveButton)

    expect(onSave).toHaveBeenCalledTimes(1)
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onClose).not.toHaveBeenCalled()
  })

  it('renders no extra action buttons beyond the close button when actions is not provided', () => {
    render(
      <Modal open onClose={vi.fn()} title="Заголовок">
        Содержимое модалки
      </Modal>,
    )

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(1)
    expect(buttons[0]).toHaveAccessibleName('Закрыть')
  })

  it('renders no extra action buttons beyond the close button when actions is an empty array', () => {
    render(
      <Modal open onClose={vi.fn()} title="Заголовок" actions={[]}>
        Содержимое модалки
      </Modal>,
    )

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(1)
    expect(buttons[0]).toHaveAccessibleName('Закрыть')
  })
})
