import { Outlet, useMatch } from 'react-router-dom'
import { useAppState } from '@/hooks/useAppState'
import { MasterDetailLayout } from '@/components/layout/MasterDetailLayout'
import { EmptyState } from '@/components/common/EmptyState'
import { ChatListItem } from '@/components/chat/ChatListItem'

export default function ChatPage() {
  const { chatThreads } = useAppState()
  const match = useMatch('/chat/:threadId')

  return (
    <MasterDetailLayout
      list={
        <div>
          <div className="border-b border-border px-4 py-4 md:px-6">
            <h2 className="text-base font-medium">聊天</h2>
          </div>
          {!chatThreads.length ? (
            <EmptyState text="尚無聊天室" />
          ) : (
            chatThreads.map((t) => <ChatListItem key={t.id} thread={t} />)
          )}
        </div>
      }
      detailActive={!!match}
      emptyState="選擇左側對話以查看訊息"
    >
      <Outlet />
    </MasterDetailLayout>
  )
}
