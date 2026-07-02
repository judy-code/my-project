import { useNavigate } from 'react-router-dom'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { useAppState } from '@/hooks/useAppState'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { logoutAccount } from '@/lib/api'

export function AccountCard() {
  const { isLoggedIn, user } = useAppState()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    if (user?.source === 'local') {
      try {
        await logoutAccount()
      } catch {
        // 後端登出失敗也讓前端照常登出，避免使用者卡在已登入畫面
      }
    }
    dispatch({ type: 'LOGOUT' })
    navigate('/')
  }

  return (
    <div className="rounded-xl border border-border p-4">
      <div className="mb-1 text-sm font-medium">帳號</div>
      <div className="mt-2 text-sm text-muted-foreground">
        {isLoggedIn && user?.email ? user.email : '訪客模式（尚未登入）'}
      </div>
      <Separator className="my-4" />
      <div className="mb-4 text-sm text-muted-foreground">
        每日邀請剩餘：<span className="font-medium text-primary">7 / 10</span>
      </div>
      {isLoggedIn && user && (
        <Button variant="outline" className="w-full" onClick={handleLogout}>
          登出
        </Button>
      )}
    </div>
  )
}
