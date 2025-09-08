import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../services/supabase'
import type { Creator, MediaAsset, Note, Rating, SocialLink, WorkItem } from '../types'
import StarRating from '../components/StarRating'

export default function CreatorDetail() {
  const { id } = useParams()
  const [creator, setCreator] = useState<Creator | null>(null)
  const [socials, setSocials] = useState<SocialLink[]>([])
  const [media, setMedia] = useState<MediaAsset[]>([])
  const [works, setWorks] = useState<WorkItem[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [ratings, setRatings] = useState<Rating[]>([])
  const [newNote, setNewNote] = useState('')
  const [newRating, setNewRating] = useState(4.5)
  const [rater, setRater] = useState('')
  const [rComment, setRComment] = useState('')
  const [workForm, setWorkForm] = useState<Partial<WorkItem>>({ title: '', status: 'Planned' as any })

  useEffect(() => {
    const load = async () => {
      const { data: c } = await supabase.from('creators').select('*').eq('id', id).single()
      setCreator(c as Creator)
      const [s, m, w, n, r] = await Promise.all([
        supabase.from('social_links').select('*').eq('creator_id', id),
        supabase.from('media_assets').select('*').eq('creator_id', id).order('created_at', { ascending: false }),
        supabase.from('work_items').select('*').eq('creator_id', id).order('start_date', { ascending: false }),
        supabase.from('notes').select('*').eq('creator_id', id).order('created_at', { ascending: false }),
        supabase.from('ratings').select('*').eq('creator_id', id).order('created_at', { ascending: false }),
      ])
      setSocials(s.data || [])
      setMedia(m.data || [])
      setWorks(w.data || [])
      setNotes(n.data || [])
      setRatings(r.data || [])
    }
    if (id) load()
  }, [id])

  const avg = useMemo(() => {
    if (!ratings.length) return 0
    const s = ratings.reduce((a, b) => a + b.stars, 0)
    return +(s / ratings.length).toFixed(2)
  }, [ratings])

  const addNote = async () => {
    if (!newNote.trim() || !id) return
    const { data, error } = await supabase.from('notes').insert({
      creator_id: id, work_item_id: null, author: 'PADI Team', body: newNote.trim()
    }).select('*').single()
    if (!error) {
      setNotes(n => [data as Note, ...n])
      setNewNote('')
    }
  }

  const addRating = async () => {
    if (!id || !newRating || !rater.trim()) return
    const { data, error } = await supabase.from('ratings').insert({
      creator_id: id, stars: newRating, rater_name: rater.trim(), comment: rComment || null
    }).select('*').single()
    if (!error) {
      setRatings(rs => [data as Rating, ...rs])
      setRater('')
      setRComment('')
    }
  }

  const addWork = async () => {
    if (!id || !workForm.title?.trim()) return
    const { data, error } = await supabase.from('work_items').insert({
      creator_id: id,
      title: workForm.title,
      campaign: workForm.campaign || null,
      status: workForm.status || 'Planned',
      start_date: workForm.start_date || null,
      end_date: workForm.end_date || null,
      deliverables: workForm.deliverables || [],
      links: workForm.links || [],
      outcomes: workForm.outcomes || null
    }).select('*').single()
    if (!error) {
      setWorks(ws => [data as WorkItem, ...ws])
      setWorkForm({ title: '', status: 'Planned' as any })
    }
  }

  const delWork = async (wid: string) => {
    await supabase.from('work_items').delete().eq('id', wid)
    setWorks(ws => ws.filter(w => w.id !== wid))
  }

  if (!creator) return <div>Loading…</div>

  return (
    <div className="space-y-6">
      <div className="card overflow-hidden">
        <div className="h-44 bg-slate-200 overflow-hidden">
          {creator.cover_url && (<img src={creator.cover_url} className="w-full h-full object-cover" />)}
        </div>
        <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-end gap-4">
          <div className="-mt-16 w-24 h-24 rounded-xl overflow-hidden ring-4 ring-white bg-slate-200">
            {creator.avatar_url && (<img src={creator.avatar_url} className="w-full h-full object-cover" />)}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold">{creator.name}</h1>
            <div className="text-sm text-slate-600">
              {(creator.categories || []).join(' · ')} {creator.country ? ` · ${creator.country}` : ''}
            </div>
            <div className="mt-2 text-sm text-slate-700">
              <span className="font-medium">Average rating:</span> {avg || 0} ({ratings.length})
            </div>
          </div>
          <Link to={`/creator/${creator.id}/edit`} className="btn btn-outline">Edit</Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <section className="card p-4 md:p-6">
            <h3 className="font-semibold mb-3">Description</h3>
            <p className="text-slate-700 whitespace-pre-wrap">{creator.description || '—'}</p>
          </section>

          <section className="card p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Previous Work</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {works.map(w => (
                <div className="border rounded-lg p-3" key={w.id}>
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{w.title}</div>
                    <button className="text-xs text-red-600" onClick={() => delWork(w.id)}>Delete</button>
                  </div>
                  <div className="text-xs text-slate-600">{w.campaign || '—'} · {w.status}</div>
                  <div className="text-sm mt-2">Links: {(w.links || []).map((l, i) => <a key={i} className="text-blue-600 underline block" href={l} target="_blank">{l}</a>)}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t pt-4">
              <div className="grid md:grid-cols-2 gap-2">
                <input className="input" placeholder="Title" value={workForm.title || ''} onChange={e => setWorkForm(f => ({...f, title: e.target.value}))} />
                <input className="input" placeholder="Campaign/Project" value={workForm.campaign || ''} onChange={e => setWorkForm(f => ({...f, campaign: e.target.value}))} />
              </div>
              <div className="grid md:grid-cols-3 gap-2 mt-2">
                <select className="input" value={workForm.status || 'Planned'} onChange={e => setWorkForm(f => ({...f, status: e.target.value as any}))}>
                  <option>Planned</option><option>In progress</option><option>Completed</option>
                </select>
                <input className="input" type="date" value={workForm.start_date || ''} onChange={e => setWorkForm(f => ({...f, start_date: e.target.value}))} />
                <input className="input" type="date" value={workForm.end_date || ''} onChange={e => setWorkForm(f => ({...f, end_date: e.target.value}))} />
              </div>
              <div className="mt-2">
                <input className="input" placeholder="Links (comma-separated URLs)" value={(workForm.links || []).join(', ')} onChange={e => setWorkForm(f => ({...f, links: e.target.value.split(',').map(s => s.trim()).filter(Boolean)}))} />
              </div>
              <div className="mt-2">
                <button className="btn btn-primary" onClick={addWork}>Add Work</button>
              </div>
            </div>
          </section>

          <section className="card p-4 md:p-6">
            <h3 className="font-semibold mb-3">Notes</h3>
            <div className="space-y-2">
              {notes.map(n => (
                <div key={n.id} className="border rounded-lg p-3">
                  <div className="text-xs text-slate-600">{new Date(n.created_at).toLocaleString()} · {n.author}</div>
                  <div className="mt-1 text-sm">{n.body}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input className="input flex-1" placeholder="Add a note…" value={newNote} onChange={e => setNewNote(e.target.value)} />
              <button className="btn btn-outline" onClick={addNote}>Add</button>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="card p-4 md:p-6">
            <h3 className="font-semibold mb-3">Socials & Site</h3>
            <ul className="space-y-1">
              {socials.map(s => (
                <li key={s.id} className="text-sm">
                  <span className="font-medium">{s.platform}:</span>{' '}
                  <a className="text-blue-600 underline break-all" href={s.url} target="_blank">{s.url}</a>
                </li>
              ))}
            </ul>
            <SocialEditor creatorId={creator.id} onChange={setSocials} />
          </section>

          <section className="card p-4 md:p-6">
            <h3 className="font-semibold mb-3">Media</h3>
            <MediaGallery items={media} />
          </section>

          <section className="card p-4 md:p-6">
            <h3 className="font-semibold mb-3">Rate this Creator</h3>
            <div className="space-y-2">
              <StarRating value={newRating} onChange={setNewRating} />
              <input className="input" placeholder="Your name (rater)" value={rater} onChange={e => setRater(e.target.value)} />
              <textarea className="input h-24" placeholder="Comment (optional)" value={rComment} onChange={e => setRComment(e.target.value)} />
              <button className="btn btn-primary w-full" onClick={addRating}>Submit Rating</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function SocialEditor({ creatorId, onChange }: { creatorId: string, onChange: (rows: any[]) => void }) {
  const [platform, setPlatform] = useState('instagram')
  const [url, setUrl] = useState('')

  const add = async () => {
    if (!url.trim()) return
    const { data, error } = await supabase.from('social_links').insert({
      creator_id: creatorId, platform, url
    }).select('*').single()
    if (!error) {
      const { data: list } = await supabase.from('social_links').select('*').eq('creator_id', creatorId)
      onChange(list || [])
      setUrl('')
    }
  }

  return (
    <div className="mt-3 flex gap-2">
      <select className="input" value={platform} onChange={e => setPlatform(e.target.value)}>
        <option value="instagram">Instagram</option>
        <option value="tiktok">TikTok</option>
        <option value="youtube">YouTube</option>
        <option value="x">X</option>
        <option value="facebook">Facebook</option>
        <option value="linkedin">LinkedIn</option>
        <option value="website">Website</option>
      </select>
      <input className="input flex-1" placeholder="https://…" value={url} onChange={e => setUrl(e.target.value)} />
      <button className="btn btn-outline" onClick={add}>Add</button>
    </div>
  )
}

function MediaGallery({ items }: { items: MediaAsset[] }) {
  if (!items.length) return <div className="text-sm text-slate-600">No media yet.</div>
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map(m => (
        <a key={m.id} href={m.url} target="_blank" className="block aspect-video bg-slate-200 overflow-hidden rounded-lg">
          {m.type === 'image' ? (
            <img src={m.url} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-slate-700 text-sm">Open {m.type}</div>
          )}
        </a>
      ))}
    </div>
  )
}
