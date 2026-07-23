import { useState } from 'react'
import { Calendar, CircleCheck, Clock, MapPin, Video } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { InterviewRatingDialog } from './InterviewRatingDialog'

const STATUS_LABEL = {
  scheduled: '面談已排定',
  completed: '面談已結束',
}

/**
 * 面談邀請卡片（PRD 5.3.3）：顯示日期/時間/形式/地點/連結，作為後續評分觸發依據。
 * 這個 App 沒有獨立的 Talent 帳號可以真的回應面談日期是否已過，所以用「標記面談已結束」
 * 明確標示為示範用途的手動觸發，取代真正的日期判斷（PRD 5.4.1 原意是系統於面談日當晚推送）。
 */
export function InterviewInviteCard({ thread }) {
  const dispatch = useAppDispatch()
  const [ratingOpen, setRatingOpen] = useState(false)
  const invite = thread.interviewInvite
  if (!invite) return null

  const markCompleted = () => {
    dispatch({ type: 'COMPLETE_INTERVIEW', threadId: thread.id })
    toast('已標記面談結束，可以開始評分了')
  }

  return (
    <div className="max-w-[88%] self-start rounded-xl rounded-bl-[3px] border border-border bg-card px-3.5 py-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-primary">面談邀請</span>
        <span className="text-[11px] text-muted-foreground">{STATUS_LABEL[invite.status]}</span>
      </div>
      <div className="flex flex-col gap-1.5 text-sm">
        <div className="flex items-center gap-1.5 text-foreground">
          <Calendar className="size-3.5 text-muted-foreground" />
          {invite.date}
          <Clock className="ml-1.5 size-3.5 text-muted-foreground" />
          {invite.time}
        </div>
        <div className="flex items-center gap-1.5 text-foreground">
          <Video className="size-3.5 text-muted-foreground" />
          {invite.format}
        </div>
        <div className="flex items-center gap-1.5 text-foreground">
          <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="break-all">{invite.location}</span>
        </div>
      </div>

      {invite.status === 'scheduled' && (
        <Button variant="outline" size="sm" className="mt-3 w-full" onClick={markCompleted}>
          （示範）標記面談已結束
        </Button>
      )}

      {invite.status === 'completed' && !invite.senderRated && (
        <Button size="sm" className="mt-3 w-full" onClick={() => setRatingOpen(true)}>
          填寫面談評分
        </Button>
      )}

      {invite.status === 'completed' && invite.senderRated && (
        <div className="mt-3 flex items-center justify-center gap-1.5 rounded-md bg-muted py-1.5 text-xs text-muted-foreground">
          <CircleCheck className="size-3.5" />
          已完成評分
        </div>
      )}

      <InterviewRatingDialog open={ratingOpen} onOpenChange={setRatingOpen} threadId={thread.id} />
    </div>
  )
}
