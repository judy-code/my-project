import { useAppState } from '@/hooks/useAppState'
import { EmptyState } from '@/components/common/EmptyState'
import { TalentCard } from './TalentCard'

export function TalentGrid() {
  const { talentPool, filterState } = useAppState()

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

  if (!list.length) return <EmptyState text="沒有符合條件的人才" />

  return (
    <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2 md:p-6 lg:grid-cols-1">
      {list.map((t) => (
        <TalentCard key={t.id} talent={t} />
      ))}
    </div>
  )
}
