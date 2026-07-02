import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppState } from '@/hooks/useAppState'
import { AppAvatar } from '@/components/common/AppAvatar'
import { FilterDrawer } from '@/components/explore/FilterDrawer'

export function TopBar() {
  const location = useLocation()
  const { filterState } = useAppState()
  const [filterOpen, setFilterOpen] = useState(false)
  const isExplore = location.pathname.startsWith('/explore')
  const activeFilterCount = Object.values(filterState).filter(Boolean).length

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3.5 md:px-6">
      <Link to="/explore" className="text-lg font-medium tracking-tight md:hidden">
        Co<span className="text-primary">Trace</span>
      </Link>
      <div className="hidden md:block" />
      <div className="flex items-center gap-4">
        {isExplore && (
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className={cn(
              'flex items-center gap-1.5 text-sm',
              activeFilterCount ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <SlidersHorizontal className="size-4" strokeWidth={1.5} />
            篩選{activeFilterCount ? ` (${activeFilterCount})` : ''}
          </button>
        )}
        <Link to="/settings" className="md:hidden">
          <AppAvatar name="林雅涵" size={32} />
        </Link>
      </div>
      <FilterDrawer open={filterOpen} onOpenChange={setFilterOpen} />
    </header>
  )
}
