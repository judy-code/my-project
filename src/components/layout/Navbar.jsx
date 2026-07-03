import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Lock, Menu, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppState } from '@/hooks/useAppState'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { AppAvatar } from '@/components/common/AppAvatar'
import { Logo } from '@/components/common/Logo'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { NAV_ITEMS } from './navItems'

/**
 * 標準網頁版面：導覽列固定在頂部（桌面版水平排列導覽項目），符合一般網頁慣例。
 * 手機版收起成漢堡選單，點擊後從左側滑出（Sheet side="left"），取代原本的底部導覽列。
 */
export function Navbar() {
  const state = useAppState()
  const dispatch = useAppDispatch()
  const [menuOpen, setMenuOpen] = useState(false)

  const { isLoggedIn, user } = state
  const pendingCount = state.invites.filter((i) => i.status === 'pending').length
  const openAuthDialog = () => dispatch({ type: 'OPEN_AUTH_DIALOG' })

  const desktopLinkClass = ({ isActive }) =>
    cn(
      'flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
      isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
    )

  const drawerLinkClass = ({ isActive }) =>
    cn(
      'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
      isActive
        ? 'bg-accent font-medium text-accent-foreground'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
    )

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-1 border-b border-border bg-background px-3 md:px-6">
      <button
        type="button"
        onClick={() => setMenuOpen(true)}
        className="flex size-9 shrink-0 items-center justify-center rounded-md text-foreground md:hidden"
        aria-label="開啟導覽選單"
      >
        <Menu className="size-5" strokeWidth={1.5} />
      </button>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-72 gap-0 p-0" showCloseButton={false}>
          <SheetTitle className="sr-only">導覽選單</SheetTitle>
          <div className="flex h-full flex-col">
            <Link to="/" className="px-5 py-5" onClick={() => setMenuOpen(false)}>
              <Logo size={24} />
            </Link>
            <nav className="flex flex-1 flex-col gap-1 px-3">
              {NAV_ITEMS.map(({ to, label, icon: Icon, badge, authRequired }) => (
                <NavLink key={to} to={to} className={drawerLinkClass} onClick={() => setMenuOpen(false)}>
                  <Icon className="size-4.5" strokeWidth={1.5} />
                  {label}
                  {authRequired && !isLoggedIn && (
                    <Lock className="ml-auto size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.5} />
                  )}
                  {badge && pendingCount > 0 && (
                    <span className="animate-in zoom-in-50 ml-auto flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-medium text-primary-foreground duration-300">
                      {pendingCount}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
            <div className="border-t border-border p-3">
              {isLoggedIn ? (
                <NavLink to="/settings" className={drawerLinkClass} onClick={() => setMenuOpen(false)}>
                  <AppAvatar name={user?.name ?? '使用者'} size={28} />
                  <span className="truncate">{user?.name ?? '使用者'}</span>
                  <Settings className="ml-auto size-4 shrink-0" strokeWidth={1.5} />
                </NavLink>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => {
                    setMenuOpen(false)
                    openAuthDialog()
                  }}
                >
                  登入 / 註冊
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Link to="/" className="mr-1 flex items-center px-1.5 md:mr-6">
        <Logo size={22} />
      </Link>

      <nav className="hidden items-center gap-1 md:flex">
        {NAV_ITEMS.map(({ to, label, icon: Icon, badge, authRequired }) => (
          <NavLink key={to} to={to} className={desktopLinkClass}>
            <Icon className="size-4" strokeWidth={1.5} />
            {label}
            {authRequired && !isLoggedIn && (
              <Lock className="size-3 text-muted-foreground" strokeWidth={1.5} />
            )}
            {badge && pendingCount > 0 && (
              <span className="animate-in zoom-in-50 flex size-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground duration-300">
                {pendingCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-4">
        {isLoggedIn ? (
          <Link to="/settings" aria-label="設置">
            <AppAvatar name={user?.name ?? '使用者'} size={32} />
          </Link>
        ) : (
          <Button size="sm" onClick={openAuthDialog}>
            登入
          </Button>
        )}
      </div>
    </header>
  )
}
