import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ResponsiveModal } from '@/components/layout/ResponsiveModal'
import { useAppState } from '@/hooks/useAppState'
import { useAppDispatch } from '@/hooks/useAppDispatch'

export function FollowedJobsManagerSheet({ open, onOpenChange }) {
  const { followedJobCards } = useAppState()
  const dispatch = useAppDispatch()

  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange} title="關注中的需求">
      <div className="flex flex-col gap-2">
        {!followedJobCards.length && <div className="text-sm text-muted-foreground">尚未關注任何需求名片</div>}
        {followedJobCards.map((job) => (
          <div key={job.id} className="rounded-md border border-border p-3">
            <div className="mb-1 flex items-start justify-between gap-2">
              <div className="min-w-0 text-sm font-medium">{job.title}</div>
              <button
                type="button"
                onClick={() => dispatch({ type: 'UNFOLLOW_JOB_CARD', id: job.id })}
                className="text-muted-foreground hover:text-primary"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="mb-2 text-xs text-muted-foreground">
              {job.company} · {job.budget}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {job.workMode.map((m) => (
                <Badge key={m} variant="secondary">
                  {m}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ResponsiveModal>
  )
}
