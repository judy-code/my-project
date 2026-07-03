import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/** 列表卡片逐一進場的動畫延遲（毫秒），搭配 `animate-in fade-in slide-in-from-bottom-2` 使用。
 *  超過 8 個之後延遲不再累加，避免長列表最後幾張卡片等太久才出現。 */
export function staggerDelay(index, step = 40) {
  return { animationDelay: `${Math.min(index, 8) * step}ms`, animationFillMode: 'backwards' }
}
