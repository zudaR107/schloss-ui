import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Header } from './Header'

afterEach(() => {
  cleanup()
})

function getHomeLink(container: HTMLElement): HTMLAnchorElement {
  const link = container.querySelector('a')
  if (!link) throw new Error('home link <a> not found')
  return link
}

describe('Header', () => {
  it('renders the home link as an <a> with the given href and title', () => {
    const { container } = render(
      <Header
        logo={<span>LOGO-MARKER</span>}
        homeHref="/dashboard"
        homeTitle="Перейти на дашборд"
      />,
    )

    const homeLink = getHomeLink(container)
    expect(homeLink).toHaveAttribute('href', '/dashboard')
    expect(homeLink).toHaveAttribute('title', 'Перейти на дашборд')
  })

  it('defaults the home link title to "На главную" when homeTitle is omitted', () => {
    const { container } = render(
      <Header logo={<span>LOGO-MARKER</span>} homeHref="/" />,
    )

    const homeLink = getHomeLink(container)
    expect(homeLink).toHaveAttribute('title', 'На главную')
  })

  it('renders the logo content inside the home link', () => {
    const { container } = render(
      <Header
        logo={<span data-testid="logo-marker">LOGO-MARKER</span>}
        homeHref="/"
      />,
    )

    const homeLink = getHomeLink(container)
    const logo = screen.getByTestId('logo-marker')
    expect(homeLink).toContainElement(logo)
  })

  it('renders no settings, logout, or avatar when neither user nor rightSlot is provided', () => {
    const { container } = render(
      <Header logo={<span>LOGO-MARKER</span>} homeHref="/" />,
    )

    expect(
      screen.queryByRole('button', { name: 'Настройки' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Выйти' }),
    ).not.toBeInTheDocument()
    // Home link is the only element expected to carry a `title` attribute
    // (the avatar is the only other element the spec says gets one, and it
    // only appears when `user` is provided).
    expect(container.querySelectorAll('[title]')).toHaveLength(1)
  })

  it('renders rightSlot content but still no settings/logout/avatar when user is not provided', () => {
    const { container } = render(
      <Header
        logo={<span>LOGO-MARKER</span>}
        homeHref="/"
        rightSlot={<button type="button">THEME-TOGGLE</button>}
      />,
    )

    expect(
      screen.getByRole('button', { name: 'THEME-TOGGLE' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Настройки' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Выйти' }),
    ).not.toBeInTheDocument()
    expect(container.querySelectorAll('[title]')).toHaveLength(1)
  })

  it('renders an avatar with the uppercased first letter and full name as title when user is provided', () => {
    render(
      <Header
        logo={<span>LOGO-MARKER</span>}
        homeHref="/"
        user={{ name: 'Роберт Эванс' }}
      />,
    )

    const avatar = screen.getByTitle('Роберт Эванс')
    expect(avatar).toHaveTextContent('Р')
    expect(avatar.textContent?.trim()).toBe('Р')
  })

  it('uppercases a lowercase first letter for the avatar initial', () => {
    render(
      <Header
        logo={<span>LOGO-MARKER</span>}
        homeHref="/"
        user={{ name: 'роберт эванс' }}
      />,
    )

    const avatar = screen.getByTitle('роберт эванс')
    expect(avatar.textContent?.trim()).toBe('Р')
  })

  it('renders the avatar as a settings control when user and onSettings are both provided, and clicking it calls onSettings once', async () => {
    // There is no separate gear icon anymore - the avatar itself is the
    // settings entry point when onSettings is given.
    const user = userEvent.setup()
    const onSettings = vi.fn()
    render(
      <Header
        logo={<span>LOGO-MARKER</span>}
        homeHref="/"
        user={{ name: 'Роберт Эванс' }}
        onSettings={onSettings}
      />,
    )

    const avatarButton = screen.getByRole('button', { name: 'Настройки аккаунта' })
    expect(avatarButton).toHaveTextContent('Р')
    await user.click(avatarButton)
    expect(onSettings).toHaveBeenCalledTimes(1)
  })

  it('renders the avatar as a plain non-interactive element (not a button) when user is provided but onSettings is not', () => {
    render(
      <Header
        logo={<span>LOGO-MARKER</span>}
        homeHref="/"
        user={{ name: 'Роберт Эванс' }}
      />,
    )

    expect(
      screen.queryByRole('button', { name: 'Настройки аккаунта' }),
    ).not.toBeInTheDocument()
    // The avatar itself must still render, just as non-interactive content.
    expect(screen.getByTitle('Роберт Эванс')).toHaveTextContent('Р')
  })

  it('does not render a settings control when onSettings is provided but user is not (no avatar to click at all)', () => {
    render(
      <Header
        logo={<span>LOGO-MARKER</span>}
        homeHref="/"
        onSettings={vi.fn()}
      />,
    )

    expect(
      screen.queryByRole('button', { name: 'Настройки аккаунта' }),
    ).not.toBeInTheDocument()
  })

  it('renders logout control when user and onLogout are both provided, and clicking it calls onLogout once', async () => {
    const user = userEvent.setup()
    const onLogout = vi.fn()
    render(
      <Header
        logo={<span>LOGO-MARKER</span>}
        homeHref="/"
        user={{ name: 'Роберт Эванс' }}
        onLogout={onLogout}
      />,
    )

    const logoutButton = screen.getByRole('button', { name: 'Выйти' })
    await user.click(logoutButton)
    expect(onLogout).toHaveBeenCalledTimes(1)
  })

  it('does not render logout control when user is provided but onLogout is not', () => {
    render(
      <Header
        logo={<span>LOGO-MARKER</span>}
        homeHref="/"
        user={{ name: 'Роберт Эванс' }}
      />,
    )

    expect(
      screen.queryByRole('button', { name: 'Выйти' }),
    ).not.toBeInTheDocument()
  })

  it('does not render logout control when onLogout is provided but user is not', () => {
    render(
      <Header logo={<span>LOGO-MARKER</span>} homeHref="/" onLogout={vi.fn()} />,
    )

    expect(
      screen.queryByRole('button', { name: 'Выйти' }),
    ).not.toBeInTheDocument()
  })

  it('renders leftSlot content', () => {
    render(
      <Header
        logo={<span>LOGO-MARKER</span>}
        homeHref="/"
        leftSlot={<button type="button">LEFT-SLOT-MARKER</button>}
      />,
    )

    expect(
      screen.getByRole('button', { name: 'LEFT-SLOT-MARKER' }),
    ).toBeInTheDocument()
  })

  it('clicking the avatar (settings) and logout controls only calls their own callbacks, without throwing', async () => {
    const user = userEvent.setup()
    const onSettings = vi.fn()
    const onLogout = vi.fn()
    render(
      <Header
        logo={<span>LOGO-MARKER</span>}
        homeHref="/"
        user={{ name: 'Роберт Эванс' }}
        onSettings={onSettings}
        onLogout={onLogout}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Настройки аккаунта' }))
    await user.click(screen.getByRole('button', { name: 'Выйти' }))

    expect(onSettings).toHaveBeenCalledTimes(1)
    expect(onLogout).toHaveBeenCalledTimes(1)
  })
})

describe('Header icon button hover feedback', () => {
  it('changes the avatar (settings) box-shadow ring on hover and reverts on unhover, without affecting which buttons are present or its click behavior', async () => {
    const user = userEvent.setup()
    const onSettings = vi.fn()
    const onLogout = vi.fn()
    render(
      <Header
        logo={<span>LOGO-MARKER</span>}
        homeHref="/"
        user={{ name: 'Роберт Эванс' }}
        onSettings={onSettings}
        onLogout={onLogout}
      />,
    )

    const avatarButton = screen.getByRole('button', { name: 'Настройки аккаунта' })
    const logoutButton = screen.getByRole('button', { name: 'Выйти' })
    const originalShadow = avatarButton.style.boxShadow

    await user.hover(avatarButton)
    expect(avatarButton.style.boxShadow).not.toBe(originalShadow)

    await user.unhover(avatarButton)
    expect(avatarButton.style.boxShadow).toBe(originalShadow)

    // Hovering does not change which buttons are present.
    expect(
      screen.getByRole('button', { name: 'Настройки аккаунта' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Выйти' })).toBeInTheDocument()

    // Click-after-hover still fires the callback as expected.
    await user.hover(avatarButton)
    await user.click(avatarButton)
    expect(onSettings).toHaveBeenCalledTimes(1)
    expect(onLogout).not.toHaveBeenCalled()

    // Sanity check the logout button too.
    const originalLogoutBackground = logoutButton.style.background
    await user.hover(logoutButton)
    expect(logoutButton.style.background).not.toBe(originalLogoutBackground)
    await user.unhover(logoutButton)
    expect(logoutButton.style.background).toBe(originalLogoutBackground)
  })
})
