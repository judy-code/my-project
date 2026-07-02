import { useState } from 'react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/common/FieldGroup'
import { ResponsiveModal } from '@/components/layout/ResponsiveModal'
import { useAppDispatch } from '@/hooks/useAppDispatch'

export function VerifyIdentityDialog({ open, onOpenChange }) {
  const dispatch = useAppDispatch()
  const [idNumber, setIdNumber] = useState('')
  const [error, setError] = useState('')

  const submit = () => {
    if (!idNumber.trim()) {
      setError('請輸入身分證字號')
      return
    }
    dispatch({ type: 'SET_VERIFIED', value: true })
    onOpenChange(false)
    setIdNumber('')
    setError('')
    toast('實名認證完成，個資定價功能已啟用')
  }

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title="實名認證"
      description="驗證你的身份，以啟用個資定價功能"
    >
      <FieldGroup label="身分證字號" error={error}>
        <Input placeholder="例：A123456789" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} />
      </FieldGroup>
      <div className="flex flex-col gap-2">
        <Button className="w-full" onClick={submit}>
          送出驗證申請
        </Button>
        <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
          取消
        </Button>
      </div>
    </ResponsiveModal>
  )
}
