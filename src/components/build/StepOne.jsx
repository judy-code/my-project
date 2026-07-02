import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { FieldGroup } from '@/components/common/FieldGroup'
import { RadioOptionList } from '@/components/common/RadioOptionList'
import { CompanyAutocomplete } from './CompanyAutocomplete'
import { LanguageMultiSelect } from './LanguageMultiSelect'
import { CAREER_LEVELS } from '@/data/careerLevels'
import { STEP_LABELS } from '@/data/stepLabels'

export function StepOne({ draft, onChange, errors }) {
  return (
    <div>
      <div className="mb-5 text-sm font-medium">{STEP_LABELS[0]}</div>

      <FieldGroup label="給自己一個稱號" hint="可自創稱號或直接填寫職稱">
        <Input
          placeholder="例：策略型產品人、跨域設計思考者"
          value={draft.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
      </FieldGroup>

      <FieldGroup label="職稱" required error={errors.jobTitle}>
        <Input
          placeholder="例：產品經理、UX 設計師"
          value={draft.jobTitle}
          onChange={(e) => onChange({ jobTitle: e.target.value })}
        />
      </FieldGroup>

      <FieldGroup label="目前的職涯落點" required error={errors.level}>
        <RadioOptionList options={CAREER_LEVELS} value={draft.level} onChange={(v) => onChange({ level: v })} />
      </FieldGroup>

      <FieldGroup label="任職公司">
        <CompanyAutocomplete value={draft.company} onChange={(v) => onChange({ company: v })} />
        <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm">
          <Checkbox
            checked={draft.companyHidden}
            onCheckedChange={(v) => onChange({ companyHidden: !!v })}
          />
          交換名片前隱藏公司名稱
        </label>
      </FieldGroup>

      <FieldGroup label="擅長語言" required error={errors.lang}>
        <LanguageMultiSelect selected={draft.lang} onChange={(v) => onChange({ lang: v })} />
      </FieldGroup>
    </div>
  )
}
