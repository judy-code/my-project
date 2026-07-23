import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarPlus, ChevronLeft } from 'lucide-react'
import { AppAvatar } from '@/components/common/AppAvatar'
import { CardView } from '@/components/common/CardView'
import { ResponsiveModal } from '@/components/layout/ResponsiveModal'
import { useAppState } from '@/hooks/useAppState'
import { MessageBubble } from './MessageBubble'
import { UnlockRequestBubble } from './UnlockRequestBubble'
import { FileUploadBubble } from './FileUploadBubble'
import { ChatInputBar } from './ChatInputBar'
import { InterviewInviteCard } from './InterviewInviteCard'
import { InterviewInviteFormDialog } from './InterviewInviteFormDialog'

function buildThreadCard(thread, invites, cardBoxList) {
  const invite = invites.find((i) => i.from === thread.name)
  if (invite) {
    return {
      talent: {
        name: invite.from,
        ini: invite.av.slice(0, 1),
        code: invite.card?.code,
        title: invite.card?.title,
        level: invite.card?.level,
        company: invite.company,
        lang: invite.card?.lang,
        skills: invite.card?.skills,
        goodAt: invite.card?.goodAt,
        wantTo: invite.card?.wantTo,
        salary: invite.card?.salary,
        salaryUnit: invite.card?.salaryUnit,
        salaryMinus: invite.card?.salaryMinus,
        location: invite.card?.location,
        workMode: invite.card?.workMode,
        ai: invite.ai,
      },
      showWant: true,
    }
  }
  const boxed = cardBoxList.find((t) => t.name === thread.name)
  if (boxed) return { talent: boxed, showWant: true }
  return {
    talent: {
      name: thread.name,
      ini: thread.av,
      company: thread.company || '',
      ai: thread.ai,
    },
    showWant: false,
  }
}

export function ChatThreadView({ thread }) {
  const { invites, cardBoxList } = useAppState()
  const navigate = useNavigate()
  const [cardOpen, setCardOpen] = useState(false)
  const [interviewFormOpen, setInterviewFormOpen] = useState(false)
  const scrollRef = useRef(null)
  const { talent, showWant } = buildThreadCard(thread, invites, cardBoxList)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [thread.msgs.length])

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3 md:px-6">
        <button type="button" onClick={() => navigate('/chat')} className="text-primary lg:hidden">
          <ChevronLeft className="size-4" />
        </button>
        <button type="button" onClick={() => setCardOpen(true)} className="flex items-center gap-3 text-left">
          <AppAvatar name={thread.name} initial={thread.av} colorIndex={thread.ai} size={36} />
          <div>
            <div className="text-sm font-medium">{thread.name}</div>
            {thread.company && <div className="text-xs text-muted-foreground">{thread.company}</div>}
          </div>
        </button>
        {!thread.interviewInvite && (
          <button
            type="button"
            onClick={() => setInterviewFormOpen(true)}
            className="ml-auto flex shrink-0 items-center gap-1 rounded-md px-2 py-1.5 text-xs text-primary hover:bg-accent"
          >
            <CalendarPlus className="size-4" strokeWidth={1.5} />
            邀約面談
          </button>
        )}
      </div>

      <div ref={scrollRef} className="flex flex-1 flex-col gap-2.5 overflow-y-auto p-4 md:p-6">
        {thread.msgs.map((m, i) =>
          m.file ? <FileUploadBubble key={i} message={m} /> : <MessageBubble key={i} message={m} />
        )}
        {thread.unlockSent && !thread.unlockDone && <UnlockRequestBubble thread={thread} />}
        {thread.interviewInvite && <InterviewInviteCard thread={thread} />}
      </div>

      <ChatInputBar threadId={thread.id} />

      <InterviewInviteFormDialog open={interviewFormOpen} onOpenChange={setInterviewFormOpen} threadId={thread.id} />

      <ResponsiveModal open={cardOpen} onOpenChange={setCardOpen}>
        <CardView talent={talent} showWant={showWant} />
      </ResponsiveModal>
    </div>
  )
}
