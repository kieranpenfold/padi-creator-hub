import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

type SessionContextType = {
  sessionReady: boolean
  isAuthed: boolean
}

const SessionContext = createContext<SessionContextType>({
  sessionReady: false,
  isAuthed: false,
})

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessionReady, setSessionReady] = useState(false)
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    const setup = async () => {
      const { data } = await supabase.auth.getSession()
      setIsAuthed(!!data.session)
      setSessionReady(true)
    }
    setup()

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  return (
    <SessionContext.Provider value={{ sessionReady, isAuthed }}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => useContext(SessionContext)
