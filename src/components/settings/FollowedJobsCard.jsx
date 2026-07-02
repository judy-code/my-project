import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAppState } from '@/hooks/useAppState'
import { FollowedJobsManagerSheet } from './FollowedJobsManagerSheet'

export function FollowedJobsCard() {
  const { followedJobCards } = useAppState()
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-xl border border-border p-4">
      <div className="mb-1 flex items-center justify-between gap-2">
        <div className="text-sm font-medium">關注中的需求</div>
        <Button size="sm" variant="outline" className="shrink-0" onClick={() => setOpen(true)}>
          管理
        </Button>
      </div>
      <div className="mt-2 text-sm text-muted-foreground">
        已關注 <span className="font-medium text-foreground">{followedJobCards.length}</span> 則需求名片
      </div>
      <FollowedJobsManagerSheet open={open} onOpenChange={setOpen} />
    </div>
  )
}
