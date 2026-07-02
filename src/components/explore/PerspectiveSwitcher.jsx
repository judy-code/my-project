import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { useAppState } from '@/hooks/useAppState'
import { useAppDispatch } from '@/hooks/useAppDispatch'

const PERSPECTIVES = [
  { value: 'hire', label: '我想求才（探索人才）', hint: '瀏覽人選名片，主動邀請合適的人才' },
  { value: 'jobseek', label: '我是人才（探索需求）', hint: '瀏覽需求名片，尋找合適的合作機會' },
]

export function PerspectiveSwitcher() {
  const { explorePerspective } = useAppState()
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
  const current = PERSPECTIVES.find((p) => p.value === explorePerspective) ?? PERSPECTIVES[0]

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="flex items-center gap-1.5 text-sm font-medium">
        {current.label}
        <ChevronDown className="size-4 text-muted-foreground" />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-3/4 sm:max-w-sm">
          <SheetHeader>
            <SheetTitle>切換探索視角</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-2 px-4">
            {PERSPECTIVES.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => {
                  dispatch({ type: 'SET_EXPLORE_PERSPECTIVE', value: p.value })
                  setOpen(false)
                }}
                className={cn(
                  'rounded-md border px-3 py-2.5 text-left text-sm transition-colors',
                  p.value === explorePerspective ? 'border-primary bg-accent' : 'border-border hover:border-primary/40'
                )}
              >
                <div className="font-medium">{p.label}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{p.hint}</div>
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
