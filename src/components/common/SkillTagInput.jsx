import { useRef, useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SkillTagInput({ value, onChange, max = 10, className }) {
  const [draft, setDraft] = useState('')
  const inputRef = useRef(null)
  const atMax = value.length >= max

  const removeSkill = (skill) => onChange(value.filter((s) => s !== skill))

  const handleKeyDown = (e) => {
    if (e.key !== 'Enter') return
    e.preventDefault()
    const v = draft.trim()
    if (v && !value.includes(v) && value.length < max) {
      onChange([...value, v])
    }
    setDraft('')
  }

  return (
    <div
      className={cn(
        'flex min-h-11 flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent p-2',
        'focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50',
        className
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((skill) => (
        <span
          key={skill}
          className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground"
        >
          {skill}
          <X
            className="size-3.5 cursor-pointer opacity-70"
            onClick={(e) => {
              e.stopPropagation()
              removeSkill(skill)
            }}
          />
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={draft}
        disabled={atMax}
        placeholder={atMax ? '已達上限' : '輸入後按 Enter 新增'}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        className="min-w-20 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
      />
    </div>
  )
}
