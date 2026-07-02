import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CardView } from '@/components/common/CardView'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { InviteForm } from './InviteForm'

export function TalentDetailPanel({ talent }) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [showInviteForm, setShowInviteForm] = useState(false)

  const handleKeep = () => {
    dispatch({ type: 'ADD_KEEP', talent })
    toast(`${talent.name} 已加入保留區`)
  }

  const handleSkip = () => {
    dispatch({ type: 'REMOVE_TALENT', id: talent.id })
    navigate('/explore')
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
        <span className="text-sm font-medium">{talent.name}</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <CardView talent={talent} showWant={false} />
        <div className="mt-4 flex gap-2">
          <Button variant="outline" className="flex-1" onClick={handleKeep}>
            保留
          </Button>
          <Button variant="outline" className="flex-1" onClick={handleSkip}>
            跳過
          </Button>
          <Button className="flex-1" onClick={() => setShowInviteForm(true)}>
            發送邀請
          </Button>
        </div>
        {showInviteForm && <InviteForm onSent={() => navigate('/explore')} />}
      </div>
    </div>
  )
}
