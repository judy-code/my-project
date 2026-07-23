import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { CircleCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RadioOptionList } from '@/components/common/RadioOptionList'
import { TagSelectGroup } from '@/components/common/TagSelectGroup'
import { StepIndicator } from '@/components/common/StepIndicator'
import { ResponsiveModal } from '@/components/layout/ResponsiveModal'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import {
  ATTENDANCE_QUESTION,
  ATTENDANCE_NOTICE_QUESTION,
  PUNCTUALITY_QUESTION,
  SENDER_RATING_DIMENSIONS,
} from '@/data/interviewOptions'

const TOTAL_STEPS = 2 + SENDER_RATING_DIMENSIONS.length // 出席 + 準時 + 各維度

function blankAnswers() {
  return {
    attendance: '',
    notice: '',
    punctuality: '',
    dimensions: Object.fromEntries(SENDER_RATING_DIMENSIONS.map((d) => [d.key, []])),
  }
}

/**
 * 面談評分（PRD 5.4）：單題導引式介面，Sender 對 Talent 的評分流程。
 * 這個 App 只有 Sender 視角（探索頁瀏覽人才、對話中發起面談的一方永遠是使用者本人），
 * 所以只實作 Sender 填答這一側；Talent 填答的維度資料留在 data/interviewOptions.js
 * 供未來若開放切換視角時使用。
 */
export function InterviewRatingDialog({ open, onOpenChange, threadId }) {
  const dispatch = useAppDispatch()
  const [phase, setPhase] = useState('attendance') // attendance / notice / punctuality / dimension / ended / done
  const [dimensionIndex, setDimensionIndex] = useState(0)
  const [answers, setAnswers] = useState(blankAnswers)

  useEffect(() => {
    if (open) {
      setPhase('attendance')
      setDimensionIndex(0)
      setAnswers(blankAnswers())
    }
  }, [open])

  const finish = (result) => {
    dispatch({ type: 'SUBMIT_INTERVIEW_RATING', threadId, result })
    toast('評分已送出，感謝你的回饋')
    onOpenChange(false)
  }

  const currentStep =
    phase === 'attendance' ? 1 : phase === 'punctuality' ? 2 : phase === 'dimension' ? 3 + dimensionIndex : null

  const toggleDimensionOption = (key, opt) => {
    setAnswers((prev) => {
      const current = prev.dimensions[key]
      const next = current.includes(opt) ? current.filter((o) => o !== opt) : [...current, opt]
      return { ...prev, dimensions: { ...prev.dimensions, [key]: next } }
    })
  }

  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange} title="面談評分">
      {currentStep && <StepIndicator step={currentStep} total={TOTAL_STEPS} />}

      {phase === 'attendance' && (
        <QuestionStep
          question={ATTENDANCE_QUESTION}
          value={answers.attendance}
          onNext={(v) => {
            setAnswers((prev) => ({ ...prev, attendance: v }))
            setPhase(v === '有出席' ? 'punctuality' : 'notice')
          }}
        />
      )}

      {phase === 'notice' && (
        <QuestionStep
          question={ATTENDANCE_NOTICE_QUESTION}
          value={answers.notice}
          nextLabel="完成"
          onNext={(v) => {
            setAnswers((prev) => ({ ...prev, notice: v }))
            setPhase('ended')
            finish({ endedEarly: true, attendance: answers.attendance, notice: v, affectsRisk: v === '未告知' })
          }}
        />
      )}

      {phase === 'punctuality' && (
        <QuestionStep
          question={PUNCTUALITY_QUESTION}
          value={answers.punctuality}
          onNext={(v) => {
            setAnswers((prev) => ({ ...prev, punctuality: v }))
            setPhase('dimension')
          }}
        />
      )}

      {phase === 'dimension' && (
        <DimensionStep
          dimension={SENDER_RATING_DIMENSIONS[dimensionIndex]}
          selected={answers.dimensions[SENDER_RATING_DIMENSIONS[dimensionIndex].key]}
          onToggle={(opt) => toggleDimensionOption(SENDER_RATING_DIMENSIONS[dimensionIndex].key, opt)}
          isLast={dimensionIndex === SENDER_RATING_DIMENSIONS.length - 1}
          onNext={() => {
            if (dimensionIndex < SENDER_RATING_DIMENSIONS.length - 1) {
              setDimensionIndex((i) => i + 1)
            } else {
              finish({
                endedEarly: false,
                attendance: answers.attendance,
                punctuality: answers.punctuality,
                dimensions: answers.dimensions,
              })
            }
          }}
        />
      )}

      {phase === 'ended' && (
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <CircleCheck className="size-8 text-primary" />
          <p className="text-sm text-muted-foreground">評分已送出</p>
        </div>
      )}
    </ResponsiveModal>
  )
}

function QuestionStep({ question, value, onNext, nextLabel = '下一題' }) {
  const [local, setLocal] = useState(value || '')
  return (
    <div>
      <div className="mb-3 text-sm font-medium">{question.q}</div>
      <RadioOptionList options={question.opts} value={local} onChange={setLocal} className="mb-4" />
      <Button className="w-full" disabled={!local} onClick={() => onNext(local)}>
        {nextLabel}
      </Button>
    </div>
  )
}

function DimensionStep({ dimension, selected, onToggle, onNext, isLast }) {
  return (
    <div>
      <div className="mb-3 text-sm font-medium">這位面談對象的「{dimension.key}」表現如何？（可複選）</div>
      <div className="mb-1.5 text-xs text-muted-foreground">正面</div>
      <TagSelectGroup options={dimension.positive} selected={selected} onToggle={onToggle} className="mb-3 flex flex-wrap gap-2" />
      <div className="mb-1.5 text-xs text-muted-foreground">負面</div>
      <TagSelectGroup options={dimension.negative} selected={selected} onToggle={onToggle} className="mb-4 flex flex-wrap gap-2" />
      <Button className="w-full" onClick={onNext}>
        {isLast ? '送出評分' : '下一題'}
      </Button>
    </div>
  )
}
