import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { AppAvatar } from '@/components/common/AppAvatar'
import { useAppState } from '@/hooks/useAppState'

export function ProfileCard({ onEditCard, onEditContact }) {
  const { cardData, isLoggedIn, user } = useAppState()
  const displayName = isLoggedIn && user?.name ? user.name : '林雅涵'

  return (
    <div className="rounded-xl border border-border p-4">
      <div className="flex items-center gap-3">
        <AppAvatar name={displayName} size={44} />
        <div>
          <div className="text-sm font-medium">{displayName}</div>
          <div className="text-xs text-muted-foreground"># {cardData.code}</div>
        </div>
      </div>
      <Separator className="my-4" />
      <Button variant="outline" className="mb-2 w-full" onClick={onEditCard}>
        重新編輯名片
      </Button>
      <Button variant="outline" className="w-full" onClick={onEditContact}>
        個人聯絡資料編輯
      </Button>
    </div>
  )
}
