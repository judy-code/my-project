import { Badge } from '@/components/ui/badge'
import { AppAvatar } from '@/components/common/AppAvatar'
import { LockedSection } from '@/components/common/LockedSection'
import { RiskBadge } from '@/components/common/RiskBadge'
import { getSalaryHint } from '@/lib/salary'

/**
 * 對應原型 buildCardView()：名片標頭 + Have 區塊 + Want 區塊（依 showWant 決定是否鎖定）。
 * 探索頁的人才詳情、邀請人名片、名片夾中的名片皆共用此元件。
 */
export function CardView({ talent, showWant }) {
  const t = talent
  const salaryText = getSalaryHint({ salary: t.salary, salaryUnit: t.salaryUnit, salaryMinus: t.salaryMinus })

  return (
    <div className="relative">
      <RiskBadge talent={t} className="absolute top-0 right-0" />
      <div className="mb-4 flex items-start gap-3">
        <AppAvatar name={t.name} initial={t.ini} colorIndex={t.ai || 0} size={56} className="text-lg" />
        <div className="min-w-0">
          <div className="text-[17px] font-medium">{t.name}</div>
          {t.code && <div className="mt-0.5 text-xs font-medium text-primary">#{t.code}</div>}
          <div className="text-sm text-muted-foreground">
            {t.title}
            {t.level ? ` · ${t.level}` : ''}
          </div>
          <div className="text-sm text-muted-foreground">
            {t.company || ''}
            {t.lang?.length ? ` · ${t.lang.join(' / ')}` : ''}
          </div>
        </div>
      </div>

      <div className="mb-2 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">Have</div>
      <div className="mb-3 rounded-xl border border-border p-4">
        {t.bio && (
          <>
            <div className="mb-1 text-xs text-muted-foreground">個人簡介</div>
            <div className="mb-2 text-sm leading-relaxed">{t.bio}</div>
          </>
        )}
        <div className="mb-1 text-xs text-muted-foreground">擅長</div>
        <div className="mb-2 text-sm">{t.goodAt || ''}</div>
        <div className="mb-1 text-xs text-muted-foreground">未來想做</div>
        <div className="mb-2 text-sm">{t.wantTo || ''}</div>
        <div className="mb-1 text-xs text-muted-foreground">核心技能</div>
        <div className="flex flex-wrap gap-1.5">
          {(t.skills || []).map((s) => (
            <Badge key={s} className="border-transparent bg-accent text-accent-foreground">
              {s}
            </Badge>
          ))}
        </div>
        {t.values?.length > 0 && (
          <>
            <div className="mt-2.5 mb-1.5 text-xs text-muted-foreground">價值觀</div>
            <div className="flex flex-wrap gap-1.5">
              {t.values.map((v) => (
                <Badge key={v} variant="secondary">
                  {v}
                </Badge>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mb-2 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">Want</div>
      {showWant ? (
        <div className="rounded-xl border border-border p-4">
          {salaryText && (
            <>
              <div className="mb-1 text-xs text-muted-foreground">薪資期待</div>
              <div className="mb-2 text-sm">{salaryText}</div>
            </>
          )}
          {t.location && (
            <>
              <div className="mb-1 text-xs text-muted-foreground">工作地點</div>
              <div className="mb-2 text-sm">{t.location}</div>
            </>
          )}
          {t.workMode?.length > 0 && (
            <>
              <div className="mb-1 text-xs text-muted-foreground">工作模式</div>
              <div className="flex flex-wrap gap-1.5">
                {t.workMode.map((m) => (
                  <Badge key={m} variant="secondary">
                    {m}
                  </Badge>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <LockedSection />
      )}
    </div>
  )
}
