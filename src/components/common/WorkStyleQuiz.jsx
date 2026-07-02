import { WORK_STYLE_QUESTIONS } from '@/data/workStyleQuestions'
import { RadioOptionList } from './RadioOptionList'

export function WorkStyleQuiz({ answers, onAnswer }) {
  return (
    <div className="flex flex-col gap-4">
      {WORK_STYLE_QUESTIONS.map((item) => (
        <div key={item.key}>
          <div className="mb-1.5 text-xs text-muted-foreground">{item.q}</div>
          <RadioOptionList
            options={item.opts}
            value={answers[item.key]}
            onChange={(v) => onAnswer(item.key, v)}
          />
        </div>
      ))}
    </div>
  )
}
