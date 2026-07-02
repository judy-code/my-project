import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { getSalaryHint } from '@/lib/salary'

const SALARY_UNITS = ['年薪', '月薪', '時薪', '按件計酬']

export function SalarySlider({ salary, salaryUnit, salaryMinus, onChange }) {
  const hint = getSalaryHint({ salary, salaryUnit, salaryMinus })

  return (
    <div>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="例：120"
          value={salary}
          onChange={(e) => onChange({ salary: e.target.value })}
          className="flex-1"
        />
        <Select value={salaryUnit} onValueChange={(v) => onChange({ salaryUnit: v })}>
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SALARY_UNITS.map((u) => (
              <SelectItem key={u} value={u}>
                {u}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mt-4 mb-1.5 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">可接受的負向調整</span>
        <span className="font-medium">{salaryMinus || 0}%</span>
      </div>
      <Slider
        min={0}
        max={50}
        step={1}
        value={[salaryMinus || 0]}
        onValueChange={([v]) => onChange({ salaryMinus: v })}
      />
      {hint && <div className="mt-2 rounded-md bg-muted p-2.5 text-xs text-muted-foreground">{hint}</div>}
    </div>
  )
}
