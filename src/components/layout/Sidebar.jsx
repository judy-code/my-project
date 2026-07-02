import { NavLink } from 'react-router-dom'
import { Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppState } from '@/hooks/useAppState'
import { AppAvatar } from '@/components/common/AppAvatar'
import { NAV_ITEMS } from './navItems'

export function Sidebar() {
  const state = useAppState()
  const pendingCount = state.invites.filter((i) => i.status === 'pending').length

  const linkClass = ({ isActive }) =>
    cn(
      'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
      isActive
        ? 'bg-accent font-medium text-accent-foreground'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
    )

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-card md:flex">
      <NavLink to="/explore" className="px-6 py-5 text-lg font-medium tracking-tight">
        Co<span className="text-primary">Trace</span>
      </NavLink>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV_ITEMS.map(({ to, label, icon: Icon, badge }) => (
          <NavLink key={to} to={to} className={linkClass}>
            <Icon className="size-4.5" strokeWidth={1.5} />
            {label}
            {badge && pendingCount > 0 && (
              <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-medium text-primary-foreground">
                {pendingCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-border p-3">
        <NavLink to="/settings" className={linkClass}>
          <AppAvatar name="林雅涵" size={28} />
          <div className="flex min-w-0 flex-1 items-center justify-between">
            <span className="truncate">林雅涵</span>
            <Settings className="size-4 shrink-0" strokeWidth={1.5} />
          </div>
        </NavLink>
      </div>
    </aside>
  )
}
