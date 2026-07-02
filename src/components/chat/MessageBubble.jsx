import { cn } from '@/lib/utils'

export function MessageBubble({ message }) {
  if (message.f === 'sys') {
    return (
      <div className="mx-auto max-w-[90%] rounded-full border border-dashed border-border px-3.5 py-2 text-center text-xs text-muted-foreground">
        {message.t}
      </div>
    )
  }

  const isMe = message.f === 'me'

  return (
    <div
      className={cn(
        'max-w-[75%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed',
        isMe
          ? 'self-end rounded-br-[3px] bg-primary text-primary-foreground'
          : 'self-start rounded-bl-[3px] bg-muted'
      )}
    >
      {message.t}
    </div>
  )
}
