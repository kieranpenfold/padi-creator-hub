import { Link } from 'react-router-dom'
import type { Creator } from '../types'

export default function CreatorCard({ c, rating }: { c: Creator; rating?: { avg: number, count: number } }) {
  const cover = c.cover_url || c.avatar_url || ''
  return (
    <Link to={`/creator/${c.id}`} className="block card overflow-hidden hover:-translate-y-0.5 transition">
      <div className="aspect-[16/9] bg-slate-200 overflow-hidden">
        {cover ? <img src={cover} alt={c.name} className="w-full h-full object-cover" /> : null}
      </div>
      <div className="p-3">
        <div className="font-medium text-slate-800">{c.name}</div>
        {c.categories?.length ? (
          <div className="mt-1 text-xs text-slate-600">{c.categories.join(' · ')}</div>
        ) : null}
        {rating ? (
          <div className="mt-2 text-xs text-slate-600">
            ⭐ {rating.avg} ({rating.count})
          </div>
        ) : null}
      </div>
    </Link>
  )
}
