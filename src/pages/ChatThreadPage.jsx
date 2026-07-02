import { useParams } from 'react-router-dom'
import { useAppState } from '@/hooks/useAppState'
import { EmptyState } from '@/components/common/EmptyState'
import { ChatThreadView } from '@/components/chat/ChatThreadView'

export default function ChatThreadPage() {
  const { threadId } = useParams()
  const { chatThreads } = useAppState()
  const thread = chatThreads.find((t) => String(t.id) === threadId)

  if (!thread) return <EmptyState text="找不到這個聊天室" />

  return <ChatThreadView thread={thread} />
}
