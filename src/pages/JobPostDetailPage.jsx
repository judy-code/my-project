import { useParams } from 'react-router-dom'
import { useAppState } from '@/hooks/useAppState'
import { EmptyState } from '@/components/common/EmptyState'
import { JobPostDetailPanel } from '@/components/explore/JobPostDetailPanel'

export default function JobPostDetailPage() {
  const { jobId } = useParams()
  const { jobCardPool } = useAppState()
  const jobPost = jobCardPool.find((j) => String(j.id) === jobId)

  if (!jobPost) return <EmptyState text="找不到這張需求名片" />

  return <JobPostDetailPanel jobPost={jobPost} />
}
