import { cn } from '@/lib/utils'
import { avatarColor } from '@/lib/avatarPalette'

/**
 * 頭像元件：以原型的 AC 色票陣列依 colorIndex 輪流上色的圓形字首頭像。
 * 因原型全程只使用字首頭像（無真實圖片），故不採用 shadcn Avatar/AvatarImage，
 * 改用可自由指定像素尺寸的自訂元件，避免受限於 shadcn size 變體(sm/default/lg)。
 */
export function AppAvatar({ name, initial, colorIndex = 0, size = 40, className, style }) {
  const c = avatarColor(colorIndex)
  const label = initial || name?.slice(0, 1) || '?'

  return (
    <div
      className={cn('flex shrink-0 items-center justify-center rounded-full font-medium', className)}
      style={{
        width: size,
        height: size,
        background: c.bg,
        color: c.fg,
        fontSize: Math.max(11, Math.round(size * 0.32)),
        ...style,
      }}
    >
      {label}
    </div>
  )
}
