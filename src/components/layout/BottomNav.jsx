import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAppState } from '@/hooks/useAppState'
import { NAV_ITEMS } from './navItems'

export function BottomNav() {
  const state = useAppState()
  const pendingCount = state.invites.filter((i) => i.status === 'pending').length

  return (
    <nav className="flex shrink-0 border-t border-border bg-background pt-2 pb-3 md:hidden">
      {NAV_ITEMS.map(({ to, label, icon: Icon, badge }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              'flex flex-1 flex-col items-center gap-1 py-1 text-[11px]',
              isActive ? 'text-primary' : 'text-muted-foreground'
            )
          }
        >
          <span className="relative flex size-5.5 items-center justify-center">
            <Icon className="size-5.5" strokeWidth={1.5} />
            {badge && pendingCount > 0 && (
              <span className="absolute -top-1 -right-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                {pendingCount}
              </span>
            )}
          </span>
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
