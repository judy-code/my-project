import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useAppState } from '@/hooks/useAppState'
import { EmptyState } from '@/components/common/EmptyState'
import { staggerDelay } from '@/lib/utils'
import { InviteRow } from '@/components/invites/InviteRow'
import { SentInviteRow } from '@/components/invites/SentInviteRow'
import { FollowNotificationRow } from '@/components/invites/FollowNotificationRow'

const TABS = [
  { value: 'received', label: '邀請' },
  { value: 'sent', label: '已邀請' },
  { value: 'follow', label: '關注' },
]

export default function InvitesPage() {
  const { invites, sentInvites, receivedFollows } = useAppState()
  const [tab, setTab] = useState('received')
  const pending = invites.filter((i) => i.status === 'pending')
  const done = invites.filter((i) => i.status !== 'pending')

  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col">
      <div className="shrink-0 border-b border-border px-4 py-4 md:px-8">
        <h2 className="text-base font-medium">通知</h2>
      </div>
      <Tabs value={tab} onValueChange={setTab} className="min-h-0 flex-1 gap-0">
        <div className="shrink-0 border-b border-border px-4 md:px-8">
          <TabsList variant="line" className="h-10 w-full justify-start">
            {TABS.map((t) => (
              <TabsTrigger key={t.value} value={t.value}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="received" className="min-h-0 flex-1 overflow-y-auto px-4 md:px-8">
          {!invites.length && <EmptyState text="尚無邀請" />}
          {pending.length > 0 && (
            <>
              <div className="pt-3 pb-1 text-xs text-muted-foreground">待回應 {pending.length} 則</div>
              {pending.map((inv, i) => (
                <div key={inv.id} className="animate-in fade-in slide-in-from-bottom-1 duration-500" style={staggerDelay(i)}>
                  <InviteRow invite={inv} />
                </div>
              ))}
            </>
          )}
          {done.length > 0 && (
            <>
              <div className="pt-4 pb-1 text-xs text-muted-foreground">已處理</div>
              {done.map((inv, i) => (
                <div key={inv.id} className="animate-in fade-in slide-in-from-bottom-1 duration-500" style={staggerDelay(i)}>
                  <InviteRow invite={inv} />
                </div>
              ))}
            </>
          )}
        </TabsContent>

        <TabsContent value="sent" className="min-h-0 flex-1 overflow-y-auto px-4 md:px-8">
          {!sentInvites.length ? (
            <EmptyState text="尚無已發送的邀請" />
          ) : (
            sentInvites.map((inv, i) => (
              <div key={inv.id} className="animate-in fade-in slide-in-from-bottom-1 duration-500" style={staggerDelay(i)}>
                <SentInviteRow invite={inv} />
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="follow" className="min-h-0 flex-1 overflow-y-auto px-4 md:px-8">
          {!receivedFollows.length ? (
            <EmptyState text="尚無關注通知" />
          ) : (
            receivedFollows.map((f, i) => (
              <div key={f.id} className="animate-in fade-in slide-in-from-bottom-1 duration-500" style={staggerDelay(i)}>
                <FollowNotificationRow follow={f} />
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
