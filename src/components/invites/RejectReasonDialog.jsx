import { useState } from 'react'
import { toast } from 'sonner'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ResponsiveModal } from '@/components/layout/ResponsiveModal'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { REJECT_REASONS } from '@/data/rejectReasons'

export function RejectReasonDialog({ open, onOpenChange, inviteId }) {
  const dispatch = useAppDispatch()
  const [checked, setChecked] = useState([])
  const [other, setOther] = useState('')
  const [error, setError] = useState('')

  const toggle = (reason) => {
    setChecked((c) => (c.includes(reason) ? c.filter((r) => r !== reason) : [...c, reason]))
  }

  const confirm = () => {
    if (!checked.length) {
      setError('請至少勾選一個原因')
      return
    }
    let reason = checked.join('、')
    if (other.trim()) reason += `（${other.trim()}）`
    dispatch({ type: 'REJECT_INVITE', id: inviteId, reason })
    onOpenChange(false)
    setChecked([])
    setOther('')
    setError('')
    toast('已回覆婉拒原因')
  }

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title="婉拒邀請"
      description="勾選拒絕原因（可複選，必填）"
      footer={
        <div className="flex w-full gap-2">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button variant="destructive" className="flex-1" onClick={confirm}>
            確認婉拒
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-2">
        {REJECT_REASONS.map((r) => (
          <label key={r} className="flex cursor-pointer items-center gap-2 text-sm">
            <Checkbox checked={checked.includes(r)} onCheckedChange={() => toggle(r)} />
            {r}
          </label>
        ))}
      </div>
      <div className="mt-3">
        <div className="mb-1.5 text-sm text-muted-foreground">其他原因（選填）</div>
        <Textarea rows={2} placeholder="補充說明..." value={other} onChange={(e) => setOther(e.target.value)} />
      </div>
      {error && <div className="mt-2 text-xs text-primary">{error}</div>}
    </ResponsiveModal>
  )
}
