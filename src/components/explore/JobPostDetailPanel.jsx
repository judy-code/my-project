import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAppState } from '@/hooks/useAppState'
import { useAppDispatch } from '@/hooks/useAppDispatch'

export function JobPostDetailPanel({ jobPost }) {
  const { followedJobCards } = useAppState()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const isFollowed = followedJobCards.some((j) => j.id === jobPost.id)

  const toggleFollow = () => {
    if (isFollowed) {
      dispatch({ type: 'UNFOLLOW_JOB_CARD', id: jobPost.id })
      toast('已取消關注')
    } else {
      dispatch({ type: 'FOLLOW_JOB_CARD', jobCard: jobPost })
      toast('已關注這則需求名片')
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-4 md:px-6">
        <button
          type="button"
          onClick={() => navigate('/explore')}
          className="flex items-center gap-1 text-sm text-primary"
        >
          <ChevronLeft className="size-4" />
          返回
        </button>
        <span className="text-sm font-medium">{jobPost.company}</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mb-1 text-[17px] font-medium">{jobPost.title}</div>
        <div className="mb-4 text-sm text-muted-foreground">
          {jobPost.company} · {jobPost.location}
        </div>

        <div className="mb-4 rounded-xl border border-border p-4">
          <div className="mb-1 text-xs text-muted-foreground">預算</div>
          <div className="mb-3 text-sm">{jobPost.budget}</div>
          <div className="mb-1 text-xs text-muted-foreground">時程</div>
          <div className="mb-3 text-sm">{jobPost.timeline}</div>
          <div className="mb-1 text-xs text-muted-foreground">所需職涯落點</div>
          <div className="mb-3 text-sm">{jobPost.level}</div>
          <div className="mb-1 text-xs text-muted-foreground">工作模式</div>
          <div className="flex flex-wrap gap-1.5">
            {jobPost.workMode.map((m) => (
              <Badge key={m} variant="secondary">
                {m}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <div className="mb-1.5 text-xs text-muted-foreground">期望技能</div>
          <div className="flex flex-wrap gap-1.5">
            {jobPost.skills.map((s) => (
              <Badge key={s} variant="secondary">
                {s}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <div className="mb-1.5 text-xs text-muted-foreground">需求描述</div>
          <div className="text-sm leading-relaxed">{jobPost.description}</div>
        </div>

        <Button className="w-full" variant={isFollowed ? 'outline' : 'default'} onClick={toggleFollow}>
          {isFollowed ? '已關注（點擊取消）' : '關注'}
        </Button>
      </div>
    </div>
  )
}
