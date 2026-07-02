import { useEffect, useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppState } from '@/hooks/useAppState'
import { useAppDispatch } from '@/hooks/useAppDispatch'

const FIELDS = [
  { key: 'titleKw', label: '稱號 / 代碼', placeholder: '例：UX設計師 或 R3AQ9' },
  { key: 'skill', label: '技能篩選', placeholder: '例：Figma' },
  { key: 'loc', label: '工作地點', placeholder: '例：台北市' },
  { key: 'sal', label: '薪資條件（萬/年，不低於）', placeholder: '例：100' },
]

export function FilterDrawer({ open, onOpenChange }) {
  const { filterState } = useAppState()
  const dispatch = useAppDispatch()
  const [draft, setDraft] = useState(filterState)

  useEffect(() => {
    if (open) setDraft(filterState)
  }, [open, filterState])

  const handleReset = () => {
    setDraft({ titleKw: '', skill: '', loc: '', sal: '' })
    dispatch({ type: 'RESET_FILTER' })
  }

  const handleApply = () => {
    dispatch({ type: 'SET_FILTER_STATE', payload: draft })
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-3/4 sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>篩選條件</SheetTitle>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-4">
          {FIELDS.map((f) => (
            <div key={f.key} className="flex flex-col gap-1.5">
              <Label className="text-xs font-normal text-muted-foreground">{f.label}</Label>
              <Input
                value={draft[f.key] || ''}
                placeholder={f.placeholder}
                onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
              />
            </div>
          ))}
        </div>
        <SheetFooter>
          <Button variant="outline" className="w-full" onClick={handleReset}>
            清除篩選
          </Button>
          <Button className="w-full" onClick={handleApply}>
            套用篩選
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
