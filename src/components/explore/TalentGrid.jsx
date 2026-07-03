import { useAppState } from '@/hooks/useAppState'
import { EmptyState } from '@/components/common/EmptyState'
import { staggerDelay } from '@/lib/utils'
import { TalentCard } from './TalentCard'

export function TalentGrid() {
  const { talentPool, filterState, receivedFollows } = useAppState()

  const list = talentPool.filter((t) => {
    if (filterState.titleKw) {
      const kw = filterState.titleKw.toUpperCase()
      if (t.title.toUpperCase().indexOf(kw) === -1 && (t.code || '').indexOf(kw) === -1) return false
    }
    if (filterState.skill) {
      const kw = filterState.skill.toLowerCase()
      if (!t.skills.some((s) => s.toLowerCase().includes(kw))) return false
    }
    if (filterState.loc && !t.loc.includes(filterState.loc)) return false
    if (filterState.sal && t.salary < (parseInt(filterState.sal, 10) || 0)) return false
    return true
  })

  // PRD 6.4.2：優先顯示篩選相符的關注人才。「除非已跳過」已經被上面的 filter 涵蓋，
  // 因為跳過會把人才從 talentPool 整個移除，不會出現在 list 裡
  const followedIds = new Set(receivedFollows.map((f) => f.talentId))
  const sorted = [...list].sort((a, b) => Number(followedIds.has(b.id)) - Number(followedIds.has(a.id)))

  if (!sorted.length) return <EmptyState text="沒有符合條件的人才" />

  return (
    <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2 md:p-6 lg:grid-cols-1">
      {sorted.map((t, i) => (
        <div key={t.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500" style={staggerDelay(i)}>
          <TalentCard talent={t} isFollower={followedIds.has(t.id)} />
        </div>
      ))}
    </div>
  )
}
