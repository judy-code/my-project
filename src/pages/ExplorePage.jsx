import { Outlet, useMatch } from 'react-router-dom'
import { MasterDetailLayout } from '@/components/layout/MasterDetailLayout'
import { TalentGrid } from '@/components/explore/TalentGrid'

export default function ExplorePage() {
  const match = useMatch('/explore/:talentId')

  return (
    <MasterDetailLayout
      list={<TalentGrid />}
      detailActive={!!match}
      emptyState="選擇左側名片以查看詳情"
    >
      <Outlet />
    </MasterDetailLayout>
  )
}
