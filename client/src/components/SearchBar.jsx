import { useEffect, useState } from 'react'

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('')

  // Debounce: schedule the search 400ms after the latest keystroke.
  // The cleanup cancels the previous timer, so only a pause in typing fires onSearch.
  useEffect(() => {
    const timer = setTimeout(() => onSearch(query.trim()), 400)
    return () => clearTimeout(timer)
  }, [query, onSearch])

  return (
    <div className="flex-1">
      <label htmlFor="search" className="sr-only">
        Search books by title or author
      </label>
      <input
        id="search"
        type="search"
        placeholder="Search by title or author..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
      />
    </div>
  )
}

export default SearchBar