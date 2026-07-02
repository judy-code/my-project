import { useContext } from 'react'
import { StateContext } from '@/state/AppContext'

export function useAppState() {
  const state = useContext(StateContext)
  if (!state) throw new Error('useAppState must be used within an AppProvider')
  return state
}
