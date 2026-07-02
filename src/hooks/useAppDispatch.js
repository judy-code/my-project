import { useContext } from 'react'
import { DispatchContext } from '@/state/AppContext'

export function useAppDispatch() {
  const dispatch = useContext(DispatchContext)
  if (!dispatch) throw new Error('useAppDispatch must be used within an AppProvider')
  return dispatch
}
