import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AppAvatar } from '@/components/common/AppAvatar'
import { CardView } from '@/components/common/CardView'
import { ResponsiveModal } from '@/components/layout/ResponsiveModal'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { RejectReasonDialog } from './RejectReasonDialog'

const STATUS_META = {
  pending: { label: '待回應', className: 'bg-status-pending-bg text-status-pending-fg' },
  accepted: { label: '已同意', className: 'bg-accent text-accent-foreground' },
  rejected: { label: '已拒絕', className: 'bg-accent text-accent-foreground' },
}

export function InviteRow({ invite }) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [cardOpen, setCardOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const status = STATUS_META[invite.status]

  const merged = {
    name: invite.from,
    ini: invite.av.slice(0, 1),
    code: invite.card?.code,
    title: invite.card?.title || invite.position,
    level: invite.card?.level,
    company: invite.company,
    lang: invite.card?.lang,
    skills: invite.card?.skills,
    goodAt: invite.card?.goodAt,
    wantTo: invite.card?.wantTo,
    values: [],
    salary: invite.card?.salary,
    salaryUnit: invite.card?.salaryUnit,
    salaryMinus: invite.card?.salaryMinus,
    location: invite.card?.location,
    workMode: invite.card?.workMode,
    ai: invite.ai,
  }

  const accept = () => {
    const newThreadId = Date.now()
    dispatch({ type: 'ACCEPT_INVITE', inviteId: invite.id, newThreadId })
    navigate(`/chat/${newThreadId}`)
  }

  return (
    <div className="flex gap-3 border-b border-border py-3.5 last:border-b-0">
      <button type="button" onClick={() => setCardOpen(true)} className="shrink-0">
        <AppAvatar name={invite.from} initial={invite.av} colorIndex={invite.ai} size={40} />
      </button>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-start justify-between gap-2">
          <div className="min-w-0 text-sm">
            <button
              type="button"
              onClick={() => setCardOpen(true)}
              className="font-medium underline decoration-border decoration-1 underline-offset-2"
            >
              {invite.from}
            </button>
            <span className="text-muted-foreground">
              {' '}
              {invite.position}
              {invite.company ? ` · ${invite.company}` : ''}
            </span>
          </div>
          <Badge className={`shrink-0 border-transparent ${status.className}`}>{status.label}</Badge>
        </div>
        <div className="mb-1 text-xs text-muted-foreground">邀請職位：{invite.role}</div>
        {invite.salary && <div className="mb-2 text-xs text-muted-foreground">{invite.salary}</div>}
        <div className="text-xs leading-relaxed">{invite.why}</div>

        {invite.status === 'pending' && (
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="destructive" className="flex-1" onClick={() => setRejectOpen(true)}>
              婉拒
            </Button>
            <Button size="sm" className="flex-1" onClick={accept}>
              同意
            </Button>
          </div>
        )}
        {invite.status === 'rejected' && invite.rejectReason && (
          <div className="mt-2 text-xs text-primary">拒絕原因：{invite.rejectReason}</div>
        )}
      </div>

      <ResponsiveModal open={cardOpen} onOpenChange={setCardOpen}>
        <CardView talent={merged} showWant />
      </ResponsiveModal>
      <RejectReasonDialog open={rejectOpen} onOpenChange={setRejectOpen} inviteId={invite.id} />
    </div>
  )
}
