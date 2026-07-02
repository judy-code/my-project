import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ResponsiveModal } from '@/components/layout/ResponsiveModal'
import { useAppState } from '@/hooks/useAppState'
import { useAppDispatch } from '@/hooks/useAppDispatch'

export function FolderPickerDialog({ open, onOpenChange, talent }) {
  const { folders } = useAppState()
  const dispatch = useAppDispatch()

  const pick = (folder) => {
    dispatch({ type: 'SET_CARDBOX_FOLDER', id: talent.id, folder })
    onOpenChange(false)
    toast(folder ? `已移至「${folder}」` : '已移除資料夾')
  }

  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange} title="選擇資料夾">
      <div className="flex flex-col gap-1.5">
        <Button
          variant={!talent?.folder ? 'default' : 'outline'}
          className="justify-start"
          onClick={() => pick('')}
        >
          （無資料夾）
        </Button>
        {folders.map((f) => (
          <Button
            key={f}
            variant={talent?.folder === f ? 'default' : 'outline'}
            className="justify-start"
            onClick={() => pick(f)}
          >
            {f}
          </Button>
        ))}
      </div>
    </ResponsiveModal>
  )
}
