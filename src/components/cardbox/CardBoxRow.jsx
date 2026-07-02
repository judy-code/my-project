import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AppAvatar } from '@/components/common/AppAvatar'
import { CardView } from '@/components/common/CardView'
import { ResponsiveModal } from '@/components/layout/ResponsiveModal'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { FolderPickerDialog } from './FolderPickerDialog'
import { CardBoxInviteDialog } from './CardBoxInviteDialog'

export function CardBoxRow({ talent, tab }) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [cardOpen, setCardOpen] = useState(false)
  const [folderOpen, setFolderOpen] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)

  const listName = tab === 'main' ? 'cardBoxList' : tab === 'keep' ? 'keepList' : 'blockList'

  const remove = () => {
    dispatch({ type: 'REMOVE_FROM_LIST', list: listName, id: talent.id })
    toast('已刪除')
  }

  return (
    <div className="flex items-center gap-3 border-b border-border py-3 last:border-b-0">
      <button type="button" onClick={() => setCardOpen(true)} className="shrink-0">
        <AppAvatar name={talent.name} initial={talent.ini} colorIndex={talent.ai} size={40} />
      </button>
      <div className="min-w-0 flex-1">
        <button type="button" onClick={() => setCardOpen(true)} className="block text-sm font-medium">
          {talent.name}
        </button>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {talent.title || ''}
          {talent.folder && (
            <Badge variant="secondary" className="text-[10px]">
              {talent.folder}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
        {tab === 'main' && (
          <>
            <Button size="sm" variant="ghost" className="h-auto px-2 py-1 text-xs" onClick={() => navigate('/chat')}>
              對話
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-auto px-2 py-1 text-xs"
              onClick={() => setFolderOpen(true)}
            >
              資料夾
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="h-auto px-2 py-1 text-xs"
              onClick={() => {
                dispatch({ type: 'MOVE_CARDBOX_TO_BLOCK', id: talent.id })
                toast(`${talent.name} 已加入黑名單`)
              }}
            >
              黑名單
            </Button>
          </>
        )}
        {tab === 'keep' &&
          (talent.inviteSent ? (
            <Badge className="border-transparent bg-status-pending-bg text-status-pending-fg">邀請中</Badge>
          ) : (
            <Button size="sm" className="h-auto px-2.5 py-1 text-xs" onClick={() => setInviteOpen(true)}>
              發送邀請
            </Button>
          ))}
        {tab === 'block' && (
          <Button
            size="sm"
            variant="outline"
            className="h-auto px-2.5 py-1 text-xs"
            onClick={() => {
              dispatch({ type: 'MOVE_BLOCK_TO_CARDBOX', id: talent.id })
              toast(`${talent.name} 已移回名片夾`)
            }}
          >
            取消黑名單
          </Button>
        )}
        <Button size="sm" variant="ghost" className="h-auto px-2 py-1 text-xs text-primary" onClick={remove}>
          刪除
        </Button>
      </div>

      <ResponsiveModal open={cardOpen} onOpenChange={setCardOpen}>
        <CardView talent={talent} showWant={tab === 'main'} />
      </ResponsiveModal>
      <FolderPickerDialog open={folderOpen} onOpenChange={setFolderOpen} talent={talent} />
      <CardBoxInviteDialog open={inviteOpen} onOpenChange={setInviteOpen} talent={talent} />
    </div>
  )
}
