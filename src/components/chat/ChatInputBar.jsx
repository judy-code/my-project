import { useRef, useState } from 'react'
import { Paperclip, Send } from 'lucide-react'
import { useAppDispatch } from '@/hooks/useAppDispatch'

export function ChatInputBar({ threadId }) {
  const dispatch = useAppDispatch()
  const [text, setText] = useState('')
  const fileInputRef = useRef(null)

  const send = () => {
    if (!text.trim()) return
    dispatch({ type: 'ADD_MESSAGE', threadId, message: { f: 'me', t: text.trim() } })
    setText('')
  }

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const isPdf = file.name.toLowerCase().endsWith('.pdf')
    if (isPdf) {
      dispatch({
        type: 'ADD_MESSAGE',
        threadId,
        message: { f: 'me', file: { type: 'pdf', name: file.name } },
      })
    } else {
      const reader = new FileReader()
      reader.onload = (ev) => {
        dispatch({
          type: 'ADD_MESSAGE',
          threadId,
          message: { f: 'me', file: { type: 'image', name: file.name, src: ev.target.result } },
        })
      }
      reader.readAsDataURL(file)
    }
    e.target.value = ''
  }

  return (
    <div className="flex shrink-0 items-center gap-2 border-t border-border px-4 py-3 md:px-6">
      <label className="flex shrink-0 cursor-pointer items-center gap-1 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted">
        <Paperclip className="size-4" strokeWidth={1.5} />
        上傳
        <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.pdf" className="hidden" onChange={handleFile} />
      </label>
      <input
        type="text"
        placeholder="輸入訊息..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && send()}
        className="flex-1 rounded-full border border-input bg-transparent px-3 py-2 text-sm outline-none focus:border-ring"
      />
      <button
        type="button"
        onClick={send}
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
      >
        <Send className="size-4" strokeWidth={2} />
      </button>
    </div>
  )
}
