import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ResponsiveModal } from '@/components/layout/ResponsiveModal'
import { useAppState } from '@/hooks/useAppState'
import { useAppDispatch } from '@/hooks/useAppDispatch'

export function FolderManagerSheet({ open, onOpenChange }) {
  const { folders } = useAppState()
  const dispatch = useAppDispatch()
  const [name, setName] = useState('')

  const addFolder = () => {
    if (!name.trim()) return
    dispatch({ type: 'ADD_FOLDER', name })
    setName('')
  }

  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange} title="自定義資料夾">
      <div className="mb-3 flex flex-col gap-1.5">
        {!folders.length && <div className="text-sm text-muted-foreground">尚無自定義資料夾</div>}
        {folders.map((f, i) => (
          <div key={f} className="flex items-center justify-between rounded-md bg-muted px-3 py-2 text-sm">
            {f}
            <button
              type="button"
              onClick={() => dispatch({ type: 'DELETE_FOLDER', index: i })}
              className="text-primary"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="新增資料夾名稱"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addFolder()}
        />
        <Button onClick={addFolder}>新增</Button>
      </div>
    </ResponsiveModal>
  )
}
