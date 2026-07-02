import { useAppState } from '@/hooks/useAppState'

export function CardBoxSummaryCard() {
  const { cardBoxList } = useAppState()

  return (
    <div className="rounded-xl border border-border p-4">
      <div className="mb-1 text-sm font-medium">名片夾</div>
      <div className="mt-2 text-sm text-muted-foreground">
        已存放 <span className="font-medium text-foreground">{cardBoxList.length}</span> 張 / 上限 200 張
      </div>
    </div>
  )
}
