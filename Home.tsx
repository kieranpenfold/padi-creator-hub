import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { Creator, Rating } from '../types'
import CreatorCard from '../components/CreatorCard'
import { summarizeRatings } from '../utils/ratings'
import { SearchProvider, useSearch } from '../components/search/useSearch'

function LibraryInner() {
  const [creators, setCreators] = useState<Creator[]>([])
  const [ratings, setRatings] = useState<Rating[]>([])
  const { query } = useSearch()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const { data: cs, error: e1 } = await supabase
        .from('creators')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(200)
      if (e1) { console.error(e1); setLoading(false); return }
      setCreators(cs || [])

      const ids = (cs || []).map(c => c.id)
      if (ids.length) {
        const { data: rs, error: e2 } = await supabase
          .from('ratings')
          .select('id, creator_id, stars, rater_name, comment, created_at')
          .in('creator_id', ids)
        if (!e2) setRatings(rs || [])
      }
      setLoading(false)
    }
    load()
  }, [])

  const ratingMap = useMemo(() => summarizeRatings(ratings), [ratings])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return creators
    return creators.filter(c => {
      const hay = `${c.name} ${c.description || ''} ${(c.tags || []).join(' ')}`.toLowerCase()
      return hay.includes(q)
    })
  }, [creators, query])

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Creators</h2>
        <Link to="/new" className="btn btn-primary">New Creator</Link>
      </div>
      {loading ? (
        <div className="text-slate-600">Loading…</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((c) => (
            <CreatorCard key={c.id} c={c} rating={ratingMap.get(c.id)} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function Home() {
  return (
    <SearchProvider>
      <LibraryInner />
    </SearchProvider>
  )
}
