import { RadioOptionList } from '@/components/common/RadioOptionList'
import { useAppState } from '@/hooks/useAppState'
import { useAppDispatch } from '@/hooks/useAppDispatch'

const OPTIONS = [
  { value: '1', label: '僅授權給同意對象開啟對話' },
  { value: '2', label: '經同意對象分享，免授權開啟對話' },
]

export function PermissionRadioCard() {
  const { permission } = useAppState()
  const dispatch = useAppDispatch()

  return (
    <div className="rounded-xl border border-border p-4">
      <div className="mb-1 text-sm font-medium">名片查閱權限</div>
      <div className="mb-3 text-xs text-muted-foreground">設定誰可以查看你的完整名片</div>
      <RadioOptionList
        options={OPTIONS.map((o) => o.label)}
        value={OPTIONS.find((o) => o.value === permission)?.label}
        onChange={(label) => {
          const opt = OPTIONS.find((o) => o.label === label)
          dispatch({ type: 'SET_PERMISSION', value: opt.value })
        }}
      />
    </div>
  )
}
