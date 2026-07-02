import { Outlet, useMatch } from 'react-router-dom'
import { MasterDetailLayout } from '@/components/layout/MasterDetailLayout'
import { TalentGrid } from '@/components/explore/TalentGrid'
import { JobPostGrid } from '@/components/explore/JobPostGrid'
import { PerspectiveSwitcher } from '@/components/explore/PerspectiveSwitcher'
import { useAppState } from '@/hooks/useAppState'

export default function ExplorePage() {
  const match = useMatch('/explore/:talentId')
  const { explorePerspective } = useAppState()

  return (
    <MasterDetailLayout
      list={
        <div className="flex h-full min-h-0 flex-col">
          <div className="shrink-0 border-b border-border px-4 py-3 md:px-6">
            <PerspectiveSwitcher />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {explorePerspective === 'jobseek' ? <JobPostGrid /> : <TalentGrid />}
          </div>
        </div>
      }
      detailActive={!!match}
      emptyState="選擇左側名片以查看詳情"
    >
      <Outlet />
    </MasterDetailLayout>
  )
}
