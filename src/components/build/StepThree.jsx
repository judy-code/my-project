import { Input } from '@/components/ui/input'
import { FieldGroup } from '@/components/common/FieldGroup'
import { SalarySlider } from '@/components/common/SalarySlider'
import { WorkStyleQuiz } from '@/components/common/WorkStyleQuiz'
import { TagSelectGroup } from '@/components/common/TagSelectGroup'
import { WORK_MODE_OPTIONS } from '@/data/workModeOptions'
import { WORK_TIME_OPTIONS } from '@/data/workTimeOptions'
import { STEP_LABELS } from '@/data/stepLabels'

export function StepThree({ draft, onChange, errors }) {
  return (
    <div>
      <div className="mb-5 text-sm font-medium">{STEP_LABELS[2]}</div>

      <FieldGroup label="期待薪資" required error={errors.salary}>
        <SalarySlider
          salary={draft.salary}
          salaryUnit={draft.salaryUnit}
          salaryMinus={draft.salaryMinus}
          onChange={onChange}
        />
      </FieldGroup>

      <FieldGroup label="期待工作地點" required error={errors.location}>
        <Input
          placeholder="例：台北市、不限地點"
          value={draft.location}
          onChange={(e) => onChange({ location: e.target.value })}
        />
      </FieldGroup>

      <FieldGroup label="期待工作模式">
        <TagSelectGroup
          options={WORK_MODE_OPTIONS}
          selected={draft.workMode}
          onToggle={(opt) =>
            onChange({
              workMode: draft.workMode.includes(opt)
                ? draft.workMode.filter((o) => o !== opt)
                : [...draft.workMode, opt],
            })
          }
        />
      </FieldGroup>

      <FieldGroup label="期待工作時段">
        <TagSelectGroup
          options={WORK_TIME_OPTIONS}
          selected={draft.workTime}
          onToggle={(opt) =>
            onChange({
              workTime: draft.workTime.includes(opt)
                ? draft.workTime.filter((o) => o !== opt)
                : [...draft.workTime, opt],
            })
          }
        />
      </FieldGroup>

      <FieldGroup label="工作風格問卷" required>
        <WorkStyleQuiz answers={draft.styleQ} onAnswer={(key, v) => onChange({ styleQ: { ...draft.styleQ, [key]: v } })} />
      </FieldGroup>
    </div>
  )
}
