import { createContext, useEffect, useReducer } from 'react'
import { appReducer } from './appReducer'
import { createInitialState } from './initialState'
import { fetchCurrentUser } from '@/lib/api'

export const StateContext = createContext(null)
export const DispatchContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, undefined, createInitialState)

  useEffect(() => {
    fetchCurrentUser()
      .then(({ user }) => dispatch({ type: 'ENTER_APP', loggedIn: true, user: { ...user, source: 'local' } }))
      .catch(() => {
        // 尚未登入（或後端未啟動）都是正常情況，維持訪客狀態即可
      })
  }, [])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  )
}
