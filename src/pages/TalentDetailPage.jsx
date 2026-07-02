import { useParams } from 'react-router-dom'
import { useAppState } from '@/hooks/useAppState'
import { EmptyState } from '@/components/common/EmptyState'
import { TalentDetailPanel } from '@/components/explore/TalentDetailPanel'

export default function TalentDetailPage() {
  const { talentId } = useParams()
  const { talentPool } = useAppState()
  const talent = talentPool.find((t) => String(t.id) === talentId)

  if (!talent) return <EmptyState text="找不到這張名片" />

  return <TalentDetailPanel talent={talent} />
}
