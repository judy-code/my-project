import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { AppAvatar } from '@/components/common/AppAvatar'
import { CardView } from '@/components/common/CardView'
import { ResponsiveModal } from '@/components/layout/ResponsiveModal'
import { CardBoxInviteDialog } from '@/components/cardbox/CardBoxInviteDialog'
import { useAppState } from '@/hooks/useAppState'
import { useAppDispatch } from '@/hooks/useAppDispatch'

export function FollowNotificationRow({ follow }) {
  const { talentPool } = useAppState()
  const dispatch = useAppDispatch()
  const [cardOpen, setCardOpen] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)
  const talent = talentPool.find((t) => t.id === follow.talentId)

  if (!talent) {
    return (
      <div className="border-b border-border py-3.5 text-sm text-muted-foreground last:border-b-0">
        一位人選關注了「{follow.jobCardTitle}」，但該名片已不在探索列表中
      </div>
    )
  }

  const keep = () => {
    dispatch({ type: 'ADD_KEEP', talent })
    toast(`${talent.name} 已加入收藏`)
  }

  const skip = () => {
    dispatch({ type: 'REMOVE_TALENT', id: talent.id })
    toast(`已跳過 ${talent.name}`)
  }

  return (
    <div className="flex gap-3 border-b border-border py-3.5 last:border-b-0">
      <button type="button" onClick={() => setCardOpen(true)} className="shrink-0">
        <AppAvatar name={talent.name} initial={talent.ini} colorIndex={talent.ai} size={40} />
      </button>
      <div className="min-w-0 flex-1">
        <button
          type="button"
          onClick={() => setCardOpen(true)}
          className="font-medium underline decoration-border decoration-1 underline-offset-2"
        >
          {talent.name}
        </button>
        <div className="text-xs text-muted-foreground">
          關注了你的需求名片「{follow.jobCardTitle}」· {follow.followedAt}
        </div>
        <div className="mt-2.5 flex gap-2">
          <Button size="sm" variant="outline" className="h-auto px-2.5 py-1 text-xs" onClick={keep}>
            收藏
          </Button>
          <Button size="sm" variant="outline" className="h-auto px-2.5 py-1 text-xs" onClick={skip}>
            跳過
          </Button>
          <Button size="sm" className="h-auto px-2.5 py-1 text-xs" onClick={() => setInviteOpen(true)}>
            邀請
          </Button>
        </div>
      </div>

      <ResponsiveModal open={cardOpen} onOpenChange={setCardOpen}>
        <CardView talent={talent} showWant={false} />
      </ResponsiveModal>
      <CardBoxInviteDialog open={inviteOpen} onOpenChange={setInviteOpen} talent={talent} />
    </div>
  )
}
