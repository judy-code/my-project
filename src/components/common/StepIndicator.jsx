import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export function StepIndicator({ step, total = 3 }) {
  const steps = Array.from({ length: total }, (_, i) => i + 1)

  return (
    <div className="mb-5 flex items-center">
      {steps.map((n, i) => {
        const state = n < step ? 'done' : n === step ? 'active' : 'pending'
        return (
          <div key={n} className="flex flex-1 items-center last:flex-none">
            <div
              className={cn(
                'flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium',
                state === 'done' && 'bg-primary text-primary-foreground',
                state === 'active' && 'border-[1.5px] border-primary bg-accent text-accent-foreground',
                state === 'pending' && 'bg-muted text-muted-foreground'
              )}
            >
              {state === 'done' ? <Check className="size-3.5" /> : n}
            </div>
            {i < steps.length - 1 && (
              <div className={cn('mx-2 h-px flex-1', n < step ? 'bg-primary' : 'bg-border')} />
            )}
          </div>
        )
      })}
    </div>
  )
}
