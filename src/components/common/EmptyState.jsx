import { PuzzleEmptyIllustration } from '@/components/common/illustrations'

export function EmptyState({ text }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-1 flex flex-col items-center gap-3 py-10 text-center duration-500">
      <PuzzleEmptyIllustration size={88} />
      <div className="text-sm text-muted-foreground">{text}</div>
    </div>
  )
}
