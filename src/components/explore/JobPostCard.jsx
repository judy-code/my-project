import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { AppAvatar } from '@/components/common/AppAvatar'

export function JobPostCard({ jobPost }) {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={() => navigate(`/explore/job/${jobPost.id}`)}
      className="w-full rounded-xl border border-border p-4 text-left transition-colors hover:border-primary"
    >
      <div className="mb-2.5 flex items-start gap-3">
        <AppAvatar name={jobPost.company} colorIndex={jobPost.ai} size={44} />
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-medium">{jobPost.company}</div>
          <div className="text-sm text-muted-foreground">{jobPost.title}</div>
          <div className="text-sm text-muted-foreground">{jobPost.budget}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {jobPost.workMode.map((m) => (
          <Badge key={m} variant="secondary">
            {m}
          </Badge>
        ))}
      </div>
    </button>
  )
}
