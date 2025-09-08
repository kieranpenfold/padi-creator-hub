import type { Rating } from '../types'

export function summarizeRatings(ratings: Rating[]) {
  const byCreator = new Map<string, { sum: number; count: number }>()
  for (const r of ratings) {
    const curr = byCreator.get(r.creator_id) || { sum: 0, count: 0 }
    curr.sum += r.stars
    curr.count += 1
    byCreator.set(r.creator_id, curr)
  }
  const avg = new Map<string, { avg: number; count: number }>()
  for (const [id, { sum, count }] of byCreator.entries()) {
    avg.set(id, { avg: count ? Number((sum / count).toFixed(2)) : 0, count })
  }
  return avg
}
