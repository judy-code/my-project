import { TagChip } from './TagChip'

/**
 * 標籤多選群組，直接對應原型 mkTagSel()：options 為此群組顯示的選項，
 * selected 則可能是跨多個群組共用的同一份陣列（例如 Step2 的價值觀）。
 */
export function TagSelectGroup({ options, selected, onToggle, className }) {
  return (
    <div className={className ?? 'flex flex-wrap gap-2'}>
      {options.map((opt) => (
        <TagChip key={opt} label={opt} selected={selected.includes(opt)} onClick={() => onToggle(opt)} />
      ))}
    </div>
  )
}
