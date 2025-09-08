import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useSession } from './providers/SessionProvider'
import TopBar from './components/TopBar'

export default function App() {
  const { sessionReady, isAuthed } = useSession()
  const nav = useNavigate()

  useEffect(() => {
    if (sessionReady && !isAuthed) {
      nav('/login', { replace: true })
    }
  }, [sessionReady, isAuthed, nav])

  if (!sessionReady) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        Checking access...
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  )
}
