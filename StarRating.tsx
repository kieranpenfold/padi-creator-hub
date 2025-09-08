import React from 'react'
type Props = {
  value: number
  onChange?: (v: number) => void
  size?: number
}

export default function StarRating({ value, onChange, size = 20 }: Props) {
  const stars = [1,2,3,4,5]
  const handle = (i: number, e: React.MouseEvent) => {
    if (!onChange) return
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    const half = e.clientX - rect.left < rect.width / 2
    const v = i - (half ? 0.5 : 0)
    onChange(v)
  }
  return (
    <div className="flex items-center gap-1">
      {stars.map((i) => {
        const full = value >= i
        const half = !full && value >= i - 0.5
        return (
          <svg
            key={i}
            onClick={(e) => handle(i, e)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={size} height={size}
            className={`cursor-pointer ${onChange ? 'opacity-90 hover:opacity-100' : ''}`}
            fill={full || half ? '#f59e0b' : 'none'} stroke="#f59e0b"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"
              d="M11.48 3.499a.562.562 0 011.04 0l2.07 4.2a.563.563 0 00.424.308l4.636.674c.513.074.717.705.346 1.066l-3.354 3.27a.563.563 0 00-.162.498l.792 4.616a.563.563 0 01-.816.593L12.7 17.933a.563.563 0 00-.522 0L7.215 18.724a.563.563 0 01-.816-.593l.792-4.616a.563.563 0 00-.162-.498L3.675 9.747a.563.563 0 01.346-1.066l4.636-.674a.563.563 0 00.424-.308l2.07-4.2z" />
          </svg>
        )
      })}
      <span className="ml-2 text-sm text-slate-600">{value.toFixed(1)}</span>
    </div>
  )
}
