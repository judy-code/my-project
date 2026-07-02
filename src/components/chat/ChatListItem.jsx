import { useNavigate } from 'react-router-dom'
import { AppAvatar } from '@/components/common/AppAvatar'
import { useAppDispatch } from '@/hooks/useAppDispatch'

export function ChatListItem({ thread }) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const open = () => {
    dispatch({ type: 'SET_THREAD_READ', threadId: thread.id })
    navigate(`/chat/${thread.id}`)
  }

  return (
    <button
      type="button"
      onClick={open}
      className="flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left transition-colors hover:bg-muted md:px-6"
    >
      <AppAvatar name={thread.name} initial={thread.av} colorIndex={thread.ai} size={44} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium">{thread.name}</span>
          <span className="text-xs text-muted-foreground">{thread.time}</span>
        </div>
        <div className="truncate text-xs text-muted-foreground">{thread.preview}</div>
      </div>
      {thread.unread && <span className="size-2 shrink-0 rounded-full bg-primary" />}
    </button>
  )
}
