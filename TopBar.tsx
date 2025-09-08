import { Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { useSession } from '../providers/SessionProvider'
import Search from './search/Search'

export default function TopBar() {
  const nav = useNavigate()
  const { isAuthed } = useSession()
  const loc = useLocation()

  const logout = async () => {
    await supabase.auth.signOut()
    nav('/login')
  }

  const showSearch = isAuthed && loc.pathname !== '/login'

  return (
    <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="font-semibold text-slate-800">
          PADI EMEA Creator Hub
        </Link>
        {showSearch && <div className="flex-1"><Search /></div>}
        {isAuthed && (
          <button onClick={logout} className="btn btn-outline">Logout</button>
        )}
      </div>
    </header>
  )
}
