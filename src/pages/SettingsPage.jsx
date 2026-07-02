import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProfileCard } from '@/components/settings/ProfileCard'
import { PermissionRadioCard } from '@/components/settings/PermissionRadioCard'
import { AccountCard } from '@/components/settings/AccountCard'
import { CardBoxSummaryCard } from '@/components/settings/CardBoxSummaryCard'
import { JobCardCard } from '@/components/settings/JobCardCard'
import { FollowedJobsCard } from '@/components/settings/FollowedJobsCard'
import { ContactEditDialog } from '@/components/settings/ContactEditDialog'

export default function SettingsPage() {
  const navigate = useNavigate()
  const [contactOpen, setContactOpen] = useState(false)

  return (
    <div className="h-full overflow-y-auto">
      <div className="border-b border-border px-4 py-4 md:px-8">
        <h2 className="text-base font-medium">設置</h2>
      </div>
      <div className="mx-auto flex max-w-xl flex-col gap-3 p-4 md:p-8">
        <ProfileCard onEditCard={() => navigate('/build')} onEditContact={() => setContactOpen(true)} />
        <PermissionRadioCard />
        <AccountCard />
        <CardBoxSummaryCard />
        <JobCardCard />
        <FollowedJobsCard />
      </div>
      <ContactEditDialog open={contactOpen} onOpenChange={setContactOpen} />
    </div>
  )
}
