import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { AppAvatar } from '@/components/common/AppAvatar'
import { RiskBadge } from '@/components/common/RiskBadge'

export function TalentCard({ talent, isFollower }) {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={() => navigate(`/explore/${talent.id}`)}
      className="relative w-full rounded-xl border border-border p-4 text-left transition-colors hover:border-primary"
    >
      <RiskBadge talent={talent} className="absolute top-3 right-3" />
      <div className="mb-2.5 flex items-start gap-3">
        <AppAvatar name={talent.name} initial={talent.ini} colorIndex={talent.ai} size={44} />
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-medium">
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
      <div className="flex flex-wrap gap-1.5">
        {talent.skills.map((s) => (
          <Badge key={s} variant="secondary">
            {s}
          </Badge>
        ))}
      </div>
    </button>
  )
}
