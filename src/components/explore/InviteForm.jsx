import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FieldGroup } from '@/components/common/FieldGroup'

export function InviteForm({ onSent }) {
  const [why, setWhy] = useState('')
  const [position, setPosition] = useState('')
  const [salary, setSalary] = useState('')
  const [error, setError] = useState('')

  const submit = () => {
    if (!why.trim()) {
      setError('請填寫邀請原因')
      return
    }
    toast('邀請已送出')
    onSent?.()
  }

  return (
    <div className="mt-4 border-t border-border pt-4">
      <div className="mb-2 text-sm font-medium">發送邀請</div>
      <div className="mb-2 text-xs text-muted-foreground">
        發送邀請後，對方可查看你的完整深層資訊（含薪資期待、工作風格等）
      </div>
      <FieldGroup label="為何邀請（Why you）" required error={error}>
        <Textarea
          rows={3}
          placeholder="說明為何邀請此人，真誠具體的說明有助提高接受率"
          value={why}
          onChange={(e) => setWhy(e.target.value)}
        />
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
    </div>
  )
}
