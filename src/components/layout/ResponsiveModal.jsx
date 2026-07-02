import { useMediaQuery } from '@/hooks/useMediaQuery'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '@/components/ui/drawer'

/**
 * 桌面版用置中 Dialog，手機版用底部滑出的 Drawer——shadcn 官方推薦的
 * 「響應式對話框」寫法，統一提供給聯絡資料編輯、實名認證、婉拒原因、
 * 資料夾選擇／管理、名片夾發送邀請等彈窗使用。
 */
export function ResponsiveModal({ open, onOpenChange, title, description, children, footer, contentClassName }) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={contentClassName ?? 'max-h-[85vh] overflow-y-auto sm:max-w-md'}>
          {title && (
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </DialogHeader>
          )}
          {children}
          {footer && <DialogFooter>{footer}</DialogFooter>}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className={contentClassName ?? 'max-h-[85vh]'}>
        {title && (
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </DrawerHeader>
        )}
        <div className="overflow-y-auto px-4 pb-2">{children}</div>
        {footer && <DrawerFooter>{footer}</DrawerFooter>}
      </DrawerContent>
    </Drawer>
  )
}
