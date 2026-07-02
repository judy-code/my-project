import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { StepIndicator } from '@/components/common/StepIndicator'
import { useAppState } from '@/hooks/useAppState'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { StepOne } from './StepOne'
import { StepTwo } from './StepTwo'
import { StepThree } from './StepThree'

function validateStep1(draft) {
  const errors = {}
  if (!draft.jobTitle.trim()) errors.jobTitle = '請填寫職稱'
  if (!draft.level) errors.level = '請選擇職涯落點'
  if (!draft.lang.length) errors.lang = '請選擇至少一種語言'
  return errors
}
function validateStep2(draft) {
  const errors = {}
  if (!draft.skills.length) errors.skills = '請新增至少一個技能標籤'
  if (!draft.goodAt.trim()) errors.goodAt = '請填寫擅長的事'
  if (!draft.wantTo.trim()) errors.wantTo = '請填寫未來想做的事'
  if (!draft.values.length) errors.values = '請選擇至少一個價值觀'
  return errors
}
function validateStep3(draft) {
  const errors = {}
  if (!String(draft.salary).trim()) errors.salary = '請填寫期待薪資'
  if (!draft.location.trim()) errors.location = '請填寫期待工作地點'
  return errors
}

export function BuildWizard() {
  const { cardData, isLoggedIn } = useAppState()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  // 精靈使用本地草稿狀態，避免中途離開時污染全域名片資料，完成時才一次性寫回 context
  const [draft, setDraft] = useState(cardData)
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState({})

  const patch = (fields) => setDraft((d) => ({ ...d, ...fields }))

  const goNext = () => {
    const validators = { 1: validateStep1, 2: validateStep2, 3: null }
    const validator = validators[step]
    if (validator) {
      const errs = validator(draft)
      if (Object.keys(errs).length) {
        setErrors(errs)
        return
      }
    }
    setErrors({})
    setStep(step + 1)
  }

  const goBack = () => {
    setErrors({})
    setStep(step - 1)
  }

  const finish = () => {
    const errs = validateStep3(draft)
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    dispatch({ type: 'SET_CARD_DATA', payload: draft })
    navigate('/explore')
  }

  const skipBuild = () => navigate('/explore')

  return (
    <div className="mx-auto max-w-xl px-4 py-6 md:px-8">
      <StepIndicator step={step} total={3} />
      {step === 1 && <StepOne draft={draft} onChange={patch} errors={errors} />}
      {step === 2 && <StepTwo draft={draft} onChange={patch} errors={errors} />}
      {step === 3 && <StepThree draft={draft} onChange={patch} errors={errors} />}

      <div className="flex gap-2">
        {step === 1 && !isLoggedIn && (
          <Button variant="ghost" onClick={skipBuild}>
            跳過建立名片
          </Button>
        )}
        {step > 1 && (
          <Button variant="outline" onClick={goBack}>
            ← 上一步
          </Button>
        )}
        {step < 3 ? (
          <Button className="flex-1" onClick={goNext}>
            下一步：{step === 1 ? 'Have' : 'Want'} →
          </Button>
        ) : (
          <Button className="flex-1" onClick={finish}>
            完成建立名片
          </Button>
        )}
      </div>
    </div>
  )
}
