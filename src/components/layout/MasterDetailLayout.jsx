import { cn } from '@/lib/utils'

/**
 * 響應式主從分割版面，共用於「探索＋人才詳情」與「聊天列表＋聊天視窗」。
 * 手機版（<lg）以 fixed + translate-x 位移實現原型 .dv/.dv.open 的滑出效果；
 * 桌面版（>=lg）取消位移、恆常顯示左右兩欄，未選取項目時顯示 emptyState（原型手機版沒有這個狀態）。
 */
export function MasterDetailLayout({ list, detailActive, emptyState, children }) {
  return (
    <div className="relative flex h-full min-h-0">
      <div className="flex h-full min-h-0 w-full flex-col overflow-y-auto lg:w-[380px] lg:shrink-0 lg:border-r lg:border-border">
        {list}
      </div>
      <div
        className={cn(
          'fixed inset-0 z-10 flex flex-col overflow-y-auto bg-background transition-transform duration-300',
          'lg:static lg:z-auto lg:flex-1 lg:translate-x-0',
          detailActive ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {detailActive ? (
          children
        ) : (
          <div className="hidden h-full items-center justify-center p-8 text-center text-sm text-muted-foreground lg:flex">
            {emptyState}
          </div>
        )}
      </div>
    </div>
  )
}
