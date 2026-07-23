import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Heart, Send, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { AppAvatar } from '@/components/common/AppAvatar'
import { EmptyState } from '@/components/common/EmptyState'
import { RiskBadge } from '@/components/common/RiskBadge'
import { useFilteredTalents } from '@/hooks/useFilteredTalents'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useRequireAuth } from '@/hooks/useRequireAuth'
import { cn } from '@/lib/utils'

const SWIPE_THRESHOLD = 100
const VISIBLE_STACK = 3

function SwipeCard({ talent, isFollower, isTop, stackIndex, onDecide, onTap }) {
  const dragRef = useRef({ startX: 0, dragging: false, moved: false })
  const [drag, setDrag] = useState({ x: 0, active: false })

  const resetDrag = () => {
    dragRef.current.dragging = false
    setDrag({ x: 0, active: false })
  }

  const handlePointerDown = (e) => {
    if (!isTop) return
    dragRef.current = { startX: e.clientX, dragging: true, moved: false }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e) => {
    if (!dragRef.current.dragging) return
    const dx = e.clientX - dragRef.current.startX
    if (Math.abs(dx) > 4) dragRef.current.moved = true
    setDrag({ x: dx, active: true })
  }

  const handlePointerUp = () => {
    if (!dragRef.current.dragging) return
    const dx = drag.x
    const moved = dragRef.current.moved
    dragRef.current.dragging = false
    if (dx > SWIPE_THRESHOLD) {
      onDecide('keep')
    } else if (dx < -SWIPE_THRESHOLD) {
      onDecide('skip')
    } else {
      setDrag({ x: 0, active: false })
      if (!moved) onTap()
    }
  }

  const rotate = drag.x / 20
  const style = isTop
    ? {
        transform: `translateX(${drag.x}px) rotate(${rotate}deg)`,
        transition: drag.active ? 'none' : 'transform 300ms ease',
      }
    : {
        transform: `scale(${1 - stackIndex * 0.04}) translateY(${stackIndex * 10}px)`,
      }

  return (
    <div
      className={cn(
        'absolute inset-0 flex flex-col overflow-hidden rounded-2xl border border-border bg-background p-5 shadow-lg select-none',
        isTop ? 'touch-none cursor-grab active:cursor-grabbing' : 'pointer-events-none'
      )}
      style={{ ...style, zIndex: 10 - stackIndex }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={resetDrag}
    >
      {isTop && drag.x > 30 && (
        <div className="absolute top-6 left-6 rotate-[-12deg] rounded-md border-2 border-primary px-2 py-1 text-sm font-bold text-primary">
          收藏
        </div>
      )}
      {isTop && drag.x < -30 && (
        <div className="absolute top-6 right-6 rotate-[12deg] rounded-md border-2 border-muted-foreground px-2 py-1 text-sm font-bold text-muted-foreground">
          跳過
        </div>
      )}
      {isTop && (
        // 擋掉 pointerdown 冒泡，避免點徽章時觸發卡片拖曳手勢
        <div className="absolute top-5 right-5 z-10" onPointerDown={(e) => e.stopPropagation()}>
          <RiskBadge talent={talent} />
        </div>
      )}
      <div className="flex items-start gap-3">
        <AppAvatar name={talent.name} initial={talent.ini} colorIndex={talent.ai} size={52} />
        <div className="min-w-0 flex-1">
          <div className="text-base font-medium">
            {talent.name} <span className="text-xs font-medium text-primary">#{talent.code}</span>
          </div>
          {isFollower && <div className="text-xs font-medium text-primary">關注了你的需求名片</div>}
          <div className="text-sm text-muted-foreground">
            {talent.title} · {talent.level}
          </div>
          <div className="text-sm text-muted-foreground">
            {talent.company} · {talent.lang.join(' / ')}
          </div>
        </div>
      </div>
      <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-muted-foreground">{talent.bio}</p>
      <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
        {talent.skills.map((s) => (
          <Badge key={s} variant="secondary">
            {s}
          </Badge>
        ))}
      </div>
    </div>
  )
}

export function TalentSwipeStack() {
  const { talents, followedIds } = useFilteredTalents()
  const dispatch = useAppDispatch()
  const requireAuth = useRequireAuth()
  const navigate = useNavigate()
  const [decidedIds, setDecidedIds] = useState(() => new Set())

  const queue = useMemo(() => talents.filter((t) => !decidedIds.has(t.id)), [talents, decidedIds])

  if (!queue.length) return <EmptyState text="這一輪的候選人都看過了，晚點再回來看看" />

  const visible = queue.slice(0, VISIBLE_STACK)
  const current = visible[0]

  const decide = (talent, action) => {
    if (action === 'keep') {
      requireAuth(() => {
        dispatch({ type: 'ADD_KEEP', talent })
        toast(`${talent.name} 已加入收藏`)
      })
    } else {
      dispatch({ type: 'REMOVE_TALENT', id: talent.id })
    }
    setDecidedIds((prev) => new Set(prev).add(talent.id))
  }

  return (
    <div className="flex h-full flex-col p-4">
      <div className="relative min-h-0 flex-1">
        {visible.map((t, i) => (
          <SwipeCard
            key={t.id}
            talent={t}
            isFollower={followedIds.has(t.id)}
            isTop={i === 0}
            stackIndex={i}
            onDecide={(action) => decide(t, action)}
            onTap={() => navigate(`/explore/${t.id}`)}
          />
        ))}
      </div>
      <div className="mt-4 flex shrink-0 items-center justify-center gap-4">
        <button
          type="button"
          aria-label="跳過"
          onClick={() => decide(current, 'skip')}
          className="flex size-14 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-transform active:scale-95"
        >
          <X className="size-6" strokeWidth={1.5} />
        </button>
        <button
          type="button"
          aria-label="發送邀請"
          onClick={() => requireAuth(() => navigate(`/explore/${current.id}`, { state: { autoInvite: true } }))}
          className="flex size-11 items-center justify-center rounded-full border border-border bg-background text-primary shadow-sm transition-transform active:scale-95"
        >
          <Send className="size-5" strokeWidth={1.5} />
        </button>
        <button
          type="button"
          aria-label="收藏"
          onClick={() => decide(current, 'keep')}
          className="flex size-14 items-center justify-center rounded-full border border-border bg-background text-primary shadow-sm transition-transform active:scale-95"
        >
          <Heart className="size-6" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  )
}
