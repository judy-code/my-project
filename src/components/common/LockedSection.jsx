import { Lock } from 'lucide-react'

export function LockedSection() {
  return (
    <div className="rounded-md border border-dashed border-border bg-muted p-4 text-center">
      <Lock className="mx-auto mb-1 size-5 text-muted-foreground" strokeWidth={1.5} />
      <div className="mb-1 text-sm text-muted-foreground">交換名片後才能查看深層資訊</div>
      <div className="text-xs text-muted-foreground">薪資期待・工作模式・工作地點・工作風格</div>
    </div>
  )
}
