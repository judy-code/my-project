import { toast } from 'sonner'
import { useAppState } from '@/hooks/useAppState'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { getContactDisplay } from '@/lib/contact'

export function UnlockRequestBubble({ thread }) {
  const { contactData } = useAppState()
  const dispatch = useAppDispatch()

  const decline = () => {
    dispatch({ type: 'SET_THREAD_UNLOCK', threadId: thread.id, payload: { unlockSent: false } })
    dispatch({ type: 'ADD_MESSAGE', threadId: thread.id, message: { f: 'sys', t: '你已婉拒個資揭露請求' } })
  }

  const accept = () => {
    dispatch({ type: 'SET_THREAD_UNLOCK', threadId: thread.id, payload: { unlockDone: true } })
    dispatch({ type: 'ADD_MESSAGE', threadId: thread.id, message: { f: 'sys', t: '你已同意揭露個人聯絡資訊' } })
    const parts = getContactDisplay(contactData)
    const revealText = parts.length ? parts.join(' · ') : '（尚未填寫聯絡資料）'
    dispatch({ type: 'ADD_MESSAGE', threadId: thread.id, message: { f: 'them', t: revealText } })
    toast('聯絡資訊已揭露')
  }

  return (
    <div className="max-w-[88%] self-start rounded-xl rounded-bl-[3px] bg-brand-purple-light px-3.5 py-2.5">
      <div className="mb-1 text-xs font-medium text-brand-purple-deep">個人聯絡資訊請求</div>
      <div className="mb-1 text-xs text-brand-purple">
        {thread.name} 希望取得你的個人聯絡資訊（姓名、電話、信箱）
      </div>
      {contactData.price ? (
        <>
          <div className="my-1 text-lg font-medium text-brand-purple">NT$ {contactData.price}</div>
          <div className="text-[11px] text-brand-purple">確認後對方支付此金額，你的聯絡資訊將揭露給對方</div>
        </>
      ) : (
        <div className="text-[11px] text-brand-purple">你尚未設定個資定價，同意後將免費揭露聯絡資訊</div>
      )}
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={decline}
          className="flex-1 rounded-md border border-primary/40 px-2.5 py-1.5 text-xs font-medium text-accent-foreground"
        >
          婉拒
        </button>
        <button
          type="button"
          onClick={accept}
          className="flex-1 rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground"
        >
          同意並揭露
        </button>
      </div>
    </div>
  )
}
