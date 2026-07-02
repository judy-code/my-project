import { cn } from '@/lib/utils'

export function FileUploadBubble({ message }) {
  const isMe = message.f === 'me'
  const { file } = message

  return (
    <div
      className={cn(
        'flex max-w-[80%] items-center gap-2.5 rounded-xl px-3.5 py-2.5',
        isMe ? 'self-end rounded-br-[3px] bg-primary' : 'self-start rounded-bl-[3px] bg-muted'
      )}
    >
      {file.type === 'pdf' ? (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-accent text-[11px] font-bold text-accent-foreground">
          PDF
        </div>
      ) : (
        <img src={file.src} alt={file.name} className="size-12 shrink-0 rounded-md object-cover" />
      )}
      <div className={cn('truncate text-xs', isMe ? 'text-primary-foreground' : 'text-foreground')}>{file.name}</div>
    </div>
  )
}
