import { Input } from '@/components/ui/input'
import { TagSelectGroup } from '@/components/common/TagSelectGroup'
import { VALUE_GROUPS } from '@/data/values'

export function ValueTagGroups({ values, valCustom, onChange }) {
  const toggle = (tag) => {
    const next = values.includes(tag) ? values.filter((v) => v !== tag) : [...values, tag]
    onChange({ values: next })
  }

  return (
    <div>
      {VALUE_GROUPS.map((g) => (
        <div key={g.label} className="mb-2.5">
          <div className="mb-1.5 text-xs text-muted-foreground">{g.label}</div>
          <TagSelectGroup options={g.tags} selected={values} onToggle={toggle} />
        </div>
      ))}
      <Input
        className="mt-1"
        placeholder="新增自定義價值觀（選填）"
        value={valCustom}
        onChange={(e) => onChange({ valCustom: e.target.value })}
      />
    </div>
  )
}
