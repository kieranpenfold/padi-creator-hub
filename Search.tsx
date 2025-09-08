import { useEffect, useState } from 'react'
import { useSearch } from './useSearch'

export default function Search() {
  const { setQuery } = useSearch()
  const [local, setLocal] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setQuery(local), 250)
    return () => clearTimeout(t)
  }, [local, setQuery])

  return (
    <input
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      placeholder="Search creators by name, bio, tags..."
      className="input"
    />
  )
}
