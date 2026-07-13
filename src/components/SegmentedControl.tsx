import { useHover } from '../hooks/useHover'

export interface SegmentedControlOption<T extends string = string> {
  value: T
  label: string
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentedControlOption<T>[]
  value: T
  onChange: (value: T) => void
}

interface SegmentProps {
  label: string
  active: boolean
  onClick: () => void
}

function Segment({ label, active, onClick }: SegmentProps) {
  const hover = useHover()
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      onMouseEnter={hover.onMouseEnter}
      onMouseLeave={hover.onMouseLeave}
      style={{
        border: 'none',
        cursor: 'pointer',
        padding: '0.375rem 0.75rem',
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.8125rem',
        fontWeight: 600,
        background: active ? 'var(--bg-surface)' : 'transparent',
        boxShadow: active ? 'var(--shadow-sm)' : 'none',
        color: active || hover.hovered ? 'var(--text-primary)' : 'var(--text-secondary)',
        transition: 'color 150ms',
      }}
    >
      {label}
    </button>
  )
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="group"
      style={{
        display: 'inline-flex',
        background: 'var(--border)',
        padding: 3,
        borderRadius: 9,
        gap: 2,
      }}
    >
      {options.map((option) => (
        <Segment
          key={option.value}
          label={option.label}
          active={option.value === value}
          onClick={() => onChange(option.value)}
        />
      ))}
    </div>
  )
}
