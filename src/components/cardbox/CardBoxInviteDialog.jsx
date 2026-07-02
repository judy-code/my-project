import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FieldGroup } from '@/components/common/FieldGroup'
import { ResponsiveModal } from '@/components/layout/ResponsiveModal'
import { useAppDispatch } from '@/hooks/useAppDispatch'

export function CardBoxInviteDialog({ open, onOpenChange, talent }) {
  const dispatch = useAppDispatch()
  const [why, setWhy] = useState('')
  const [position, setPosition] = useState('')
  const [salary, setSalary] = useState('')
  const [error, setError] = useState('')

  const submit = () => {
    if (!why.trim()) {
      setError('請填寫邀請原因')
      return
    }
    dispatch({ type: 'MARK_KEEP_INVITE_SENT', id: talent.id })
    onOpenChange(false)
    setWhy('')
    setPosition('')
    setSalary('')
    setError('')
    toast(`已向 ${talent.name} 發送邀請`)
  }

  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange} title={`發送邀請給 ${talent?.name ?? ''}`}>
      <div className="mb-2 text-xs text-muted-foreground">發送邀請後，對方可查看你的完整深層資訊</div>
      <FieldGroup label="為何邀請（Why you）" required error={error}>
        <Textarea rows={3} placeholder="說明為何邀請此人" value={why} onChange={(e) => setWhy(e.target.value)} />
      </FieldGroup>
      <FieldGroup label="職位名稱（選填）">
        <Input placeholder="例：Senior UX Designer" value={position} onChange={(e) => setPosition(e.target.value)} />
      </FieldGroup>
      <FieldGroup label="薪資條件（選填）">
        <Input placeholder="例：NT$120–140萬/年薪" value={salary} onChange={(e) => setSalary(e.target.value)} />
      </FieldGroup>
      <Button className="w-full" onClick={submit}>
        確認送出邀請
      </Button>
    </ResponsiveModal>
  )
}
