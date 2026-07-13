export interface SegmentedControlOption<T extends string = string> {
  value: T
  label: string
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentedControlOption<T>[]
  value: T
  onChange: (value: T) => void
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
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            style={{
              border: 'none',
              cursor: 'pointer',
              padding: '0.375rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              background: active ? 'var(--bg-surface)' : 'transparent',
              boxShadow: active ? 'var(--shadow-sm)' : 'none',
              color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
            }}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
