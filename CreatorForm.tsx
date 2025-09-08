import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../services/supabase'
import type { Creator } from '../../types'

type Mode = 'create' | 'edit'
export default function CreatorForm({ mode }: { mode: Mode }) {
  const { id } = useParams()
  const nav = useNavigate()
  const [loading, setLoading] = useState(mode === 'edit')
  const [form, setForm] = useState<Partial<Creator>>({
    name: '',
    categories: [],
    tags: []
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      if (mode === 'edit' && id) {
        const { data, error } = await supabase.from('creators').select('*').eq('id', id).single()
        if (error) { setError(error.message); return }
        setForm(data as Creator)
        setLoading(false)
      }
    }
    load()
  }, [id, mode])

  const onChange = (k: keyof Creator, v: any) => setForm(s => ({ ...s, [k]: v }))

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!form.name) { setError('Name is required.'); return }
    if (mode === 'create') {
      const { data, error } = await supabase.from('creators').insert({
        name: form.name,
        pronouns: form.pronouns || null,
        categories: form.categories || [],
        country: form.country || null,
        timezone: form.timezone || null,
        email: form.email || null,
        phone: form.phone || null,
        agent_name: form.agent_name || null,
        agent_email: form.agent_email || null,
        description: form.description || null,
        tags: form.tags || [],
        avatar_url: form.avatar_url || null,
        cover_url: form.cover_url || null
      }).select('id').single()
      if (error) { setError(error.message); return }
      nav(`/creator/${data!.id}`)
    } else if (mode === 'edit' && id) {
      const { error } = await supabase.from('creators').update({
        name: form.name,
        pronouns: form.pronouns || null,
        categories: form.categories || [],
        country: form.country || null,
        timezone: form.timezone || null,
        email: form.email || null,
        phone: form.phone || null,
        agent_name: form.agent_name || null,
        agent_email: form.agent_email || null,
        description: form.description || null,
        tags: form.tags || [],
        avatar_url: form.avatar_url || null,
        cover_url: form.cover_url || null
      }).eq('id', id)
      if (error) { setError(error.message); return }
      nav(`/creator/${id}`)
    }
  }

  if (loading) return <div>Loading…</div>

  return (
    <form onSubmit={save} className="card p-4 md:p-6 space-y-4">
      <h2 className="text-lg font-semibold">{mode === 'create' ? 'New Creator' : 'Edit Creator'}</h2>
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="block text-sm mb-1">Name *</label>
          <input className="input" value={form.name || ''} onChange={e => onChange('name', e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Pronouns</label>
          <input className="input" value={form.pronouns || ''} onChange={e => onChange('pronouns', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Categories (comma-separated)</label>
          <input className="input" value={(form.categories || []).join(', ')} onChange={e => onChange('categories', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
        </div>
        <div>
          <label className="block text-sm mb-1">Tags (comma-separated)</label>
          <input className="input" value={(form.tags || []).join(', ')} onChange={e => onChange('tags', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
        </div>
        <div>
          <label className="block text-sm mb-1">Country</label>
          <input className="input" value={form.country || ''} onChange={e => onChange('country', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Timezone</label>
          <input className="input" value={form.timezone || ''} onChange={e => onChange('timezone', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input className="input" value={form.email || ''} onChange={e => onChange('email', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Phone</label>
          <input className="input" value={form.phone || ''} onChange={e => onChange('phone', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Agent/Manager</label>
          <input className="input" value={form.agent_name || ''} onChange={e => onChange('agent_name', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Agent Email</label>
          <input className="input" value={form.agent_email || ''} onChange={e => onChange('agent_email', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Description/Bio</label>
          <textarea className="input h-28" value={form.description || ''} onChange={e => onChange('description', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Avatar URL</label>
          <input className="input" value={form.avatar_url || ''} onChange={e => onChange('avatar_url', e.target.value)} placeholder="(or upload in Creator page)"/>
        </div>
        <div>
          <label className="block text-sm mb-1">Cover URL</label>
          <input className="input" value={form.cover_url || ''} onChange={e => onChange('cover_url', e.target.value)} placeholder="(or upload in Creator page)"/>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="btn btn-primary" type="submit">{mode === 'create' ? 'Create' : 'Save'}</button>
        <button className="btn btn-outline" type="button" onClick={() => window.history.back()}>Cancel</button>
      </div>
    </form>
  )
}
