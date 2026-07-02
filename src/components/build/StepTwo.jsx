import { Textarea } from '@/components/ui/textarea'
import { FieldGroup } from '@/components/common/FieldGroup'
import { SkillTagInput } from '@/components/common/SkillTagInput'
import { ValueTagGroups } from './ValueTagGroups'
import { STEP_LABELS } from '@/data/stepLabels'

export function StepTwo({ draft, onChange, errors }) {
  return (
    <div>
      <div className="mb-5 text-sm font-medium">{STEP_LABELS[1]}</div>

      <FieldGroup label="個人簡介">
        <Textarea
          rows={3}
          placeholder="簡短介紹自己"
          value={draft.bio}
          onChange={(e) => onChange({ bio: e.target.value })}
        />
      </FieldGroup>

      <FieldGroup label="核心技能標籤" hint="最多10個，Enter 新增" required error={errors.skills}>
        <SkillTagInput value={draft.skills} onChange={(v) => onChange({ skills: v })} />
      </FieldGroup>

      <FieldGroup label="我擅長的是" required error={errors.goodAt}>
        <Textarea
          rows={2}
          placeholder="例：從 0 到 1 定義產品方向"
          value={draft.goodAt}
          onChange={(e) => onChange({ goodAt: e.target.value })}
        />
      </FieldGroup>

      <FieldGroup label="我未來想做的是" required error={errors.wantTo}>
        <Textarea
          rows={2}
          placeholder="例：打造有社會影響力的產品"
          value={draft.wantTo}
          onChange={(e) => onChange({ wantTo: e.target.value })}
        />
      </FieldGroup>

      <FieldGroup label="價值觀" hint="可複選" required error={errors.values}>
        <ValueTagGroups values={draft.values} valCustom={draft.valCustom} onChange={onChange} />
      </FieldGroup>
    </div>
  )
}
