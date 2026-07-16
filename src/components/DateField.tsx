import { useRef, useState } from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Field, type FieldInputProps } from './Field'
import { Calendar } from './Calendar'
import { CalendarPopover } from './CalendarPopover'
import { formatDisplayDate, parseISODate } from '../lib/dateUtils'

export interface DateFieldProps extends Omit<FieldInputProps, 'type' | 'value' | 'onChange' | 'as' | 'readOnly'> {
  /** ISO yyyy-mm-dd, '' = unset. */
  value: string
  onChange: (value: string) => void
}

export function DateField({ value, onChange, style, ...rest }: DateFieldProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  function handleDayClick(iso: string) {
    onChange(iso)
    setOpen(false)
  }

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <Field
        {...rest}
        type="text"
        inputMode="none"
        readOnly
        value={value ? formatDisplayDate(value) : ''}
        placeholder="Выберите дату"
        onClick={() => setOpen((o) => !o)}
        suffix={<CalendarIcon size={16} />}
        style={{ cursor: 'pointer', ...style }}
      />
      <CalendarPopover open={open} onClose={() => setOpen(false)} anchorRef={containerRef}>
        <Calendar
          initialMonth={parseISODate(value) ?? new Date()}
          start={value}
          end=""
          hoverEnd={null}
          onDayClick={handleDayClick}
          onDayHover={() => {}}
        />
      </CalendarPopover>
    </div>
  )
}
