import { cn } from '@/lib/utils'

export function TagChip({ label, selected, onClick, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1.5 text-sm transition-colors',
        selected
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-transparent text-foreground hover:border-primary/50',
        className
      )}
    >
      {label}
    </button>
  )
}
