import { Input } from '@/components/ui/input'

/**
 * 通用的搜尋輸入 + 下拉選單元件，直接對應原型的 .sw/.sdd/.so 結構。
 * 採用「先 onMouseDown 選取，再讓 onBlur 收合」的互動模式，
 * 刻意不使用 Radix Popover/Command，以完整保留原型的互動細節。
 */
export function AutocompleteSearch({
  value,
  onChange,
  open,
  onOpenChange,
  results,
  searching,
  emptyText = '找不到符合的結果',
  placeholder,
  onSelect,
  inputId,
  disabled,
}) {
  return (
    <div className="relative">
      <Input
        id={inputId}
        type="text"
        autoComplete="off"
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          onOpenChange(true)
        }}
        onFocus={() => value && onOpenChange(true)}
        onBlur={() => setTimeout(() => onOpenChange(false), 200)}
      />
      {open && value.trim() && (
        <div className="absolute top-full right-0 left-0 z-30 mt-1 max-h-52 overflow-y-auto rounded-md border border-border bg-popover shadow-md">
          {searching ? (
            <div className="px-3 py-2.5 text-sm text-muted-foreground">搜尋中...</div>
          ) : results.length ? (
            results.map((item) => (
              <div
                key={item}
                onMouseDown={() => onSelect(item)}
                className="cursor-pointer border-b border-border px-3 py-2.5 text-sm last:border-b-0 hover:bg-accent hover:text-accent-foreground"
              >
                {item}
              </div>
            ))
          ) : (
            <div className="px-3 py-2.5 text-sm text-muted-foreground">{emptyText}</div>
          )}
        </div>
      )}
    </div>
  )
}
