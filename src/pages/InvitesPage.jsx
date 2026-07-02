import { useAppState } from '@/hooks/useAppState'
import { EmptyState } from '@/components/common/EmptyState'
import { InviteRow } from '@/components/invites/InviteRow'

export default function InvitesPage() {
  const { invites } = useAppState()
  const pending = invites.filter((i) => i.status === 'pending')
  const done = invites.filter((i) => i.status !== 'pending')

  return (
    <div className="h-full overflow-y-auto">
      <div className="border-b border-border px-4 py-4 md:px-8">
        <h2 className="text-base font-medium">邀請</h2>
      </div>
      <div className="mx-auto max-w-2xl px-4 md:px-8">
        {!invites.length && <EmptyState text="尚無邀請" />}
        {pending.length > 0 && (
          <>
            <div className="pt-3 pb-1 text-xs text-muted-foreground">待回應 {pending.length} 則</div>
            {pending.map((inv) => (
              <InviteRow key={inv.id} invite={inv} />
            ))}
          </>
        )}
        {done.length > 0 && (
          <>
            <div className="pt-4 pb-1 text-xs text-muted-foreground">已處理</div>
            {done.map((inv) => (
              <InviteRow key={inv.id} invite={inv} />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
