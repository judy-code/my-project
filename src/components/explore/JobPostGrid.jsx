import { useAppState } from '@/hooks/useAppState'
import { EmptyState } from '@/components/common/EmptyState'
import { staggerDelay } from '@/lib/utils'
import { JobPostCard } from './JobPostCard'

export function JobPostGrid() {
  const { jobCardPool, filterState } = useAppState()

  // 預算是自由格式文字（例：「140–160萬/年薪」「股權為主，可談」），
  // 不像人選名片的 salary 是純數字，所以不套用 filterState.sal 這個數字比較篩選
  const list = jobCardPool.filter((j) => {
    if (filterState.titleKw && !j.title.toUpperCase().includes(filterState.titleKw.toUpperCase())) return false
    if (filterState.skill) {
      const kw = filterState.skill.toLowerCase()
      if (!j.skills.some((s) => s.toLowerCase().includes(kw))) return false
    }
    if (filterState.loc && !j.location.includes(filterState.loc)) return false
    return true
  })

  if (!list.length) return <EmptyState text="沒有符合條件的需求名片" />

  return (
    <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2 md:p-6 lg:grid-cols-1">
      {list.map((j, i) => (
        <div key={j.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500" style={staggerDelay(i)}>
          <JobPostCard jobPost={j} />
        </div>
      ))}
    </div>
  )
}
