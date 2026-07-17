import type { ReactNode } from 'react'
import { LogOut } from 'lucide-react'
import { useHover } from '../hooks/useHover'

export interface HeaderUser {
  name: string
}

export interface HeaderProps {
  /** The service's own brand mark, rendered inside the accent-colored badge. */
  logo: ReactNode
  /** Where the logo/badge links to - the logo slot is itself the home link. */
  homeHref: string
  /** Tooltip on the home link. */
  homeTitle?: string
  user?: HeaderUser | null
  onSettings?: () => void
  onLogout?: () => void
  /** Anything service-specific rendered before the icon group, e.g. a mobile nav toggle. */
  leftSlot?: ReactNode
  /** Anything service-specific rendered before settings/logout/avatar, e.g. a theme toggle. */
  rightSlot?: ReactNode
}

function initial(name: string): string {
  return name.trim().charAt(0).toUpperCase()
}

interface HeaderIconButtonProps {
  onClick: () => void
  title: string
  children: ReactNode
}

function HeaderIconButton({ onClick, title, children }: HeaderIconButtonProps) {
  const hover = useHover()
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      onMouseEnter={hover.onMouseEnter}
      onMouseLeave={hover.onMouseLeave}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: hover.hovered ? 'var(--bg-base)' : 'none',
        border: 'none',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        color: hover.hovered ? 'var(--text-primary)' : 'var(--text-secondary)',
        padding: 4,
        transition: 'background 150ms, color 150ms',
      }}
    >
      {children}
    </button>
  )
}

const AVATAR_STYLE = {
  width: 28,
  height: 28,
  flexShrink: 0,
  borderRadius: '50%',
  background: 'var(--accent)',
  color: '#fff',
  fontSize: '0.75rem',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
} as const

interface AvatarProps {
  user: HeaderUser
  onSettings?: () => void
}

// The avatar doubles as the settings entry point (there is no separate
// gear icon anymore) - a real <button> with a hover ring when onSettings
// is given, a plain non-interactive circle otherwise. `title` stays just
// the person's name either way (useful on its own, since the avatar is
// only ever a single initial); the click action is described separately
// via aria-label so screen readers get both.
function Avatar({ user, onSettings }: AvatarProps) {
  const hover = useHover()

  if (!onSettings) {
    return <div title={user.name} style={AVATAR_STYLE}>{initial(user.name)}</div>
  }

  return (
    <button
      type="button"
      onClick={onSettings}
      title={user.name}
      aria-label="Настройки аккаунта"
      onMouseEnter={hover.onMouseEnter}
      onMouseLeave={hover.onMouseLeave}
      style={{
        ...AVATAR_STYLE,
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        boxShadow: hover.hovered ? '0 0 0 2px var(--bg-surface), 0 0 0 4px var(--accent)' : 'none',
        transition: 'box-shadow 150ms',
      }}
    >
      {initial(user.name)}
    </button>
  )
}

export function Header({
  logo,
  homeHref,
  homeTitle = 'На главную',
  user,
  onSettings,
  onLogout,
  leftSlot,
  rightSlot,
}: HeaderProps) {
  return (
    <header
      style={{
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
        padding: '0 1.5rem',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-sm)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        gap: '0.75rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {leftSlot}
        <a
          href={homeHref}
          title={homeTitle}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            flexShrink: 0,
            background: 'var(--accent)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          {logo}
        </a>
      </div>

      {(user || rightSlot) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          {rightSlot}
          {user && onLogout && (
            <HeaderIconButton onClick={onLogout} title="Выйти">
              <LogOut size={16} strokeWidth={2} />
            </HeaderIconButton>
          )}
          {user && <Avatar user={user} onSettings={onSettings} />}
        </div>
      )}
    </header>
  )
}
