import { useState, useEffect, type ReactNode } from 'react'
import { Sun, Moon, Monitor, Coffee } from 'lucide-react'
import { Button } from './Button'
import { type Theme, THEMES, getStoredTheme, applyTheme } from '../lib/theme'

const ICONS: Record<Theme, ReactNode> = {
  light: <Sun size={16} />,
  dark: <Moon size={16} />,
  oled: <Monitor size={16} />,
  sepia: <Coffee size={16} />,
}

const LABELS: Record<Theme, string> = {
  light: 'Светлая',
  dark: 'Тёмная',
  oled: 'OLED',
  sepia: 'Сепия',
}

export interface ThemeToggleTriggerProps {
  theme: Theme
  icon: ReactNode
  onClick: () => void
}

export interface ThemeToggleProps {
  /**
   * Custom trigger element, for contexts that don't fit the default
   * ghost-icon-button look (e.g. kuvert's sidebar, which renders its own
   * full-width row style). Receives the current theme/icon and a click
   * handler that opens/closes the dropdown - call it from your own
   * clickable element.
   */
  trigger?: (props: ThemeToggleTriggerProps) => ReactNode
  /** Horizontal anchor for the dropdown panel. Default 'right' (fits a
   * header's right-aligned icon strip); 'left' avoids running off-screen
   * when the trigger sits near the left edge (e.g. a sidebar). */
  align?: 'left' | 'right'
}

export function ThemeToggle({ trigger, align = 'right' }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>(getStoredTheme)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  function select(t: Theme) {
    setTheme(t)
    setOpen(false)
  }

  const toggleOpen = () => setOpen((o) => !o)

  return (
    <div style={{ position: 'relative' }}>
      {trigger ? (
        trigger({ theme, icon: ICONS[theme], onClick: toggleOpen })
      ) : (
        <Button
          variant="ghost"
          style={{ padding: '0.4rem', border: 'none' }}
          onClick={toggleOpen}
          aria-label="Сменить тему"
        >
          {ICONS[theme]}
        </Button>
      )}

      {open && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 40 }}
            onClick={() => setOpen(false)}
          />
          <div
            style={{
              position: 'absolute',
              [align]: 0,
              top: 'calc(100% + 8px)',
              zIndex: 50,
              minWidth: 140,
              padding: '0.375rem',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              // Inlined equivalent of the app-level `.card-elevated` utility
              // (not part of schloss-ui) - kept self-contained like every
              // other component here, driven only by tokens.css variables.
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            {THEMES.map((t) => (
              <button
                key={t}
                onClick={() => select(t)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 0.625rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  background: t === theme ? 'var(--accent-muted)' : 'transparent',
                  color: t === theme ? 'var(--accent-text)' : 'var(--text-secondary)',
                  width: '100%',
                  textAlign: 'left',
                  transition: 'background 120ms',
                }}
              >
                {ICONS[t]}
                {LABELS[t]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
