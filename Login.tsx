import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'

const HUB_EMAIL = import.meta.env.VITE_CREATOR_HUB_EMAIL as string

export default function Login() {
  const [passcode, setPasscode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const nav = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav('/', { replace: true })
    })
  }, [nav])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({
      email: HUB_EMAIL,
      password: passcode
    })
    setLoading(false)
    if (error) {
      setError('Incorrect passcode.')
      return
    }
    nav('/', { replace: true })
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <form onSubmit={submit} className="card w-full max-w-sm p-6 space-y-4">
        <div>
          <h1 className="text-xl font-semibold">PADI EMEA Creator Hub</h1>
          <p className="text-slate-600 text-sm mt-1">Enter passcode to access.</p>
        </div>
        <input
          className="input"
          type="password"
          placeholder="Passcode"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="btn btn-primary w-full" disabled={loading}>
          {loading ? 'Checking...' : 'Enter'}
        </button>
      </form>
    </div>
  )
}
