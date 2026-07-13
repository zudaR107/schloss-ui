import type { ReactNode } from 'react'
import { LogOut, Settings } from 'lucide-react'

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

const iconButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--text-secondary)',
  padding: 4,
} as const

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
          {user && onSettings && (
            <button
              type="button"
              onClick={onSettings}
              title="Настройки"
              aria-label="Настройки"
              style={iconButtonStyle}
            >
              <Settings size={16} strokeWidth={2} />
            </button>
          )}
          {user && onLogout && (
            <button
              type="button"
              onClick={onLogout}
              title="Выйти"
              aria-label="Выйти"
              style={iconButtonStyle}
            >
              <LogOut size={16} strokeWidth={2} />
            </button>
          )}
          {user && (
            <div
              title={user.name}
              style={{
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
              }}
            >
              {initial(user.name)}
            </div>
          )}
        </div>
      )}
    </header>
  )
}
