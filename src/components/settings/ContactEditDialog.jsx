import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Check } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FieldGroup } from '@/components/common/FieldGroup'
import { ResponsiveModal } from '@/components/layout/ResponsiveModal'
import { useAppState } from '@/hooks/useAppState'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { AREA_CODES } from '@/data/areaCodes'
import { EMAIL_DOMAINS } from '@/data/emailDomains'
import { VerifyIdentityDialog } from './VerifyIdentityDialog'

export function ContactEditDialog({ open, onOpenChange }) {
  const { contactData, isVerified } = useAppState()
  const dispatch = useAppDispatch()
  const [draft, setDraft] = useState(contactData)
  const [verifyOpen, setVerifyOpen] = useState(false)

  useEffect(() => {
    if (open) setDraft(contactData)
  }, [open, contactData])

  const patch = (fields) => setDraft((d) => ({ ...d, ...fields }))

  const save = () => {
    dispatch({ type: 'SET_CONTACT_DATA', payload: draft })
    onOpenChange(false)
    toast('聯絡資料已儲存')
  }

  return (
    <>
      <ResponsiveModal open={open} onOpenChange={onOpenChange} title="個人聯絡資料">
        <div
          className={
            isVerified
              ? 'mb-4 flex items-center justify-between rounded-md border border-status-verified-border bg-status-verified-bg px-3 py-2.5'
              : 'mb-4 flex items-center justify-between rounded-md border border-border bg-muted px-3 py-2.5'
          }
        >
          <div>
            <div className="text-sm font-medium">{isVerified ? '已完成實名認證' : '尚未完成實名認證'}</div>
            <div className="text-xs text-muted-foreground">
              {isVerified ? '個資定價功能已啟用' : '完成認證後才能設定個資定價'}
            </div>
          </div>
          {isVerified ? (
            <Check className="size-5 shrink-0 text-status-verified-fg" />
          ) : (
            <Button size="sm" className="shrink-0" onClick={() => setVerifyOpen(true)}>
              前往認證
            </Button>
          )}
        </div>

        <FieldGroup label="姓名">
          <div className="flex gap-2">
            <Input placeholder="姓" className="flex-1" value={draft.lastName} onChange={(e) => patch({ lastName: e.target.value })} />
            <Input placeholder="名" className="flex-[2]" value={draft.firstName} onChange={(e) => patch({ firstName: e.target.value })} />
          </div>
        </FieldGroup>

        <FieldGroup label="連絡電話">
          <div className="flex gap-2">
            <Select value={draft.areaCode} onValueChange={(v) => patch({ areaCode: v })}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AREA_CODES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input placeholder="電話號碼" className="flex-1" value={draft.phone} onChange={(e) => patch({ phone: e.target.value })} />
          </div>
        </FieldGroup>

        <FieldGroup label="聯絡信箱">
          <div className="flex items-center gap-2">
            <Input placeholder="帳號" className="flex-1" value={draft.emailAccount} onChange={(e) => patch({ emailAccount: e.target.value })} />
            <span className="text-sm text-muted-foreground">@</span>
            <Select value={draft.emailDomain} onValueChange={(v) => patch({ emailDomain: v })}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EMAIL_DOMAINS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d === 'custom' ? '自填網域' : d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {draft.emailDomain === 'custom' && (
            <Input
              className="mt-1.5"
              placeholder="輸入網域，例：company.com"
              value={draft.emailCustomDomain}
              onChange={(e) => patch({ emailCustomDomain: e.target.value })}
            />
          )}
        </FieldGroup>

        <FieldGroup label="個資定價" hint="Sender 請求你的個人聯絡資訊時，需支付的金額">
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-sm text-muted-foreground">NT$</span>
            <Input
              placeholder={isVerified ? '例：500' : '請先完成實名認證'}
              disabled={!isVerified}
              value={draft.price}
              onChange={(e) => patch({ price: e.target.value })}
            />
          </div>
        </FieldGroup>

        <Button className="w-full" onClick={save}>
          儲存
        </Button>
      </ResponsiveModal>

      <VerifyIdentityDialog open={verifyOpen} onOpenChange={setVerifyOpen} />
    </>
  )
}
