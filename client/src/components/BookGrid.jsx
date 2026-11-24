import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import BookCard from './BookCard.jsx'

function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="h-36 bg-gray-200" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 rounded bg-gray-200" />
        <div className="h-3 w-1/2 rounded bg-gray-200" />
        <div className="h-3 w-1/3 rounded bg-gray-200" />
      </div>
    </div>
  )
}

function BookGrid({ genreId, search, sort }) {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [attempt, setAttempt] = useState(0)

  // Refetch whenever the genre or search term changes (or the user clicks Retry)
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    const params = { limit: 100 }
    if (genreId) params.genreId = genreId
    if (search) params.search = search

    axios
      .get(`${import.meta.env.VITE_API_URL}/books`, {
        params,
        signal: controller.signal,
      })
      .then((res) => setBooks(res.data.data))
      .catch((err) => {
        if (axios.isCancel(err)) return
        console.error(err)
        setError(
          err.response
            ? 'The server could not load the books. Please try again.'
            : 'Could not reach the server. Make sure the API is running.',
        )
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    // Cancel the in-flight request if filters change before it finishes
    return () => controller.abort()
  }, [genreId, search, attempt])

  // Stretch: client-side sort by title or author
  const sortedBooks = useMemo(() => {
    const [field, direction] = sort.split('-')
    const sorted = [...books].sort((a, b) => a[field].localeCompare(b[field]))
    return direction === 'desc' ? sorted.reverse() : sorted
  }, [books, sort])

  if (loading) {
    return (
      <div aria-busy="true">
        <p className="sr-only">Loading books...</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="font-medium text-red-700">{error}</p>
        <button
          onClick={() => setAttempt((n) => n + 1)}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Try again
        </button>
      </div>
    )
  }

  if (sortedBooks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
        <p className="font-medium">No books found</p>
        <p className="mt-1 text-sm text-gray-600">
          Try a different search term or choose another genre.
        </p>
      </div>
    )
  }

  return (
    <div>
      <p className="mb-3 text-sm text-gray-600">
        Showing {sortedBooks.length} {sortedBooks.length === 1 ? 'book' : 'books'}
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sortedBooks.map((b) => (
          <BookCard key={b.id} book={b} />
        ))}
      </div>
    </div>
  )
}

export default BookGrid