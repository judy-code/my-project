import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'

/**
 * 對應原型的 .ri（radio-item）整列可點選樣式：選中時邊框與底色變化，
 * 而非僅顯示一顆小圓點。用於職涯落點、工作風格問卷、名片查閱權限等單選情境。
 */
export function RadioOptionList({ options, value, onChange, className }) {
  return (
    <RadioGroup value={value} onValueChange={onChange} className={cn('gap-2', className)}>
      {options.map((opt) => (
        <label
          key={opt}
          className={cn(
            'flex cursor-pointer items-start gap-2.5 rounded-md border px-3 py-2.5 text-sm transition-colors',
            value === opt ? 'border-primary bg-accent' : 'border-border hover:border-primary/40'
          )}
        >
          <RadioGroupItem value={opt} className="mt-0.5" />
          <span>{opt}</span>
        </label>
      ))}
    </RadioGroup>
  )
}
