import { useState } from 'react'
import { CircleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import { RISK_LEVELS, resolveRiskLevel } from '@/data/riskLevels'
import { ResponsiveModal } from '@/components/layout/ResponsiveModal'

/**
 * 面談風險警示徽章（PRD 5.2）：顏色 + 圓圈驚嘆號，顯示於名片名稱旁、整體介面右上角，
 * 不與名片代碼共用同一行。點擊後顯示去識別化的「回饋摘要分布」，不含個別評論。
 * 名片資料沒有 riskLevel／reviewCount 時（例如聊天室臨時組出的名片）直接不渲染。
 */
export function RiskBadge({ talent, className }) {
  const [open, setOpen] = useState(false)
  const level = resolveRiskLevel(talent)
  if (!level) return null
  const info = RISK_LEVELS[level]

  return (
    <>
      {/* 不能用 <button>：這個徽章常被放進 TalentCard／CardView 本身就是 <button> 或包在
          可點擊卡片裡的情境，HTML 不允許 button 巢狀 button（會噴 hydration 錯誤） */}
      <span
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation()
          setOpen(true)
        }}
        onKeyDown={(e) => {
          if (e.key !== 'Enter' && e.key !== ' ') return
          e.preventDefault()
          e.stopPropagation()
          setOpen(true)
        }}
        title={`${info.label}：${info.description}`}
        className={cn(
          'flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full text-white transition-transform hover:scale-110',
          info.colorClass,
          className
        )}
      >
        <CircleAlert className="size-3.5" strokeWidth={2.5} />
      </span>

      <ResponsiveModal open={open} onOpenChange={setOpen} title="面談回饋摘要" description={`${talent.name}．${info.label}`}>
        <FeedbackDistribution talent={talent} level={level} />
      </ResponsiveModal>
    </>
  )
}

function FeedbackDistribution({ talent, level }) {
  const info = RISK_LEVELS[level]

  if (level === 'insufficient') {
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <span className="flex size-10 items-center justify-center rounded-full bg-status-risk-insufficient text-white">
          <CircleAlert className="size-5" strokeWidth={2.5} />
        </span>
        <p className="text-sm text-muted-foreground">
          目前僅有 {talent.reviewCount ?? 0} 筆面談評價，未達 5 筆門檻，暫不足以呈現風險等級。
        </p>
      </div>
    )
  }

  const distribution = talent.feedbackDistribution || {}

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 rounded-md border border-border px-3 py-2.5 text-sm">
        <span className={cn('flex size-6 shrink-0 items-center justify-center rounded-full text-white', info.colorClass)}>
          <CircleAlert className="size-3.5" strokeWidth={2.5} />
        </span>
        <span className="font-medium">{info.label}</span>
        <span className="text-xs text-muted-foreground">· 共 {talent.reviewCount} 筆面談評價</span>
      </div>

      <div className="flex flex-col gap-3">
        {Object.entries(distribution).map(([dimension, { positive, negative }]) => (
          <div key={dimension}>
            <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
              <span>{dimension}</span>
              <span>
                正向 {positive}% · 負向 {negative}%
              </span>
            </div>
            <div className="flex h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-status-risk-low" style={{ width: `${positive}%` }} />
              <div className="h-full bg-status-risk-high" style={{ width: `${negative}%` }} />
            </div>
          </div>
        ))}
      </div>

      {talent.feedbackSummary && (
        <p className="rounded-md bg-muted px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
          {talent.feedbackSummary}
        </p>
      )}
      <p className="text-[11px] text-muted-foreground">
        以上為去識別化統計結果，不顯示個別評論內容。
      </p>
    </div>
  )
}
