import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldGroup } from '@/components/common/FieldGroup'
import { RadioOptionList } from '@/components/common/RadioOptionList'
import { ResponsiveModal } from '@/components/layout/ResponsiveModal'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { INTERVIEW_FORMAT_OPTIONS } from '@/data/interviewOptions'

/** 面談邀請表單（PRD 5.3）：僅設於對話視窗內，Sender 專屬入口 */
export function InterviewInviteFormDialog({ open, onOpenChange, threadId }) {
  const dispatch = useAppDispatch()
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [format, setFormat] = useState(INTERVIEW_FORMAT_OPTIONS[0])
  const [location, setLocation] = useState('')
  const [error, setError] = useState('')

  const submit = () => {
    if (!date || !time || !location.trim()) {
      setError('請完整填寫日期、時間與地點/連結')
      return
    }
    dispatch({ type: 'SEND_INTERVIEW_INVITE', threadId, payload: { date, time, format, location: location.trim() } })
    toast('面談邀請已送出')
    onOpenChange(false)
    setDate('')
    setTime('')
    setFormat(INTERVIEW_FORMAT_OPTIONS[0])
    setLocation('')
    setError('')
  }

  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange} title="邀約面談" description="送出後將在對話中生成面談邀請卡片">
      <FieldGroup label="日期" required>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </FieldGroup>
      <FieldGroup label="時間" required>
        <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
      </FieldGroup>
      <FieldGroup label="形式" required>
        <RadioOptionList options={INTERVIEW_FORMAT_OPTIONS} value={format} onChange={setFormat} />
      </FieldGroup>
      <FieldGroup label="地點 / 連結" required error={error}>
        <Input placeholder="例：台北市信義區松仁路 / Google Meet 連結" value={location} onChange={(e) => setLocation(e.target.value)} />
      </FieldGroup>
      <Button className="w-full" onClick={submit}>
        送出面談邀請
      </Button>
    </ResponsiveModal>
  )
}
