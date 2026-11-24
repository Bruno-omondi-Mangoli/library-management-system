import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import ReadingListButton from '../components/ReadingListButton.jsx'

function BookDetail() {
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    axios
      .get(`${import.meta.env.VITE_API_URL}/books/${id}`, {
        signal: controller.signal,
      })
      .then((res) => setBook(res.data))
      .catch((err) => {
        if (axios.isCancel(err)) return
        console.error(err)
        if (err.response?.status === 404) {
          setError('Book not found.')
        } else if (err.response) {
          setError('The server could not load this book.')
        } else {
          setError('Could not reach the server. Make sure the API is running.')
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [id])

  const backLink = (
    <Link to="/" className="mb-4 inline-block text-indigo-600 hover:underline">
      ← Back to catalog
    </Link>
  )

  if (loading) {
    return (
      <div aria-busy="true">
        {backLink}
        <p className="sr-only">Loading book...</p>
        <div className="animate-pulse space-y-4 rounded-xl border border-gray-200 bg-white p-6">
          <div className="h-8 w-2/3 rounded bg-gray-200" />
          <div className="h-4 w-1/3 rounded bg-gray-200" />
          <div className="h-4 w-1/2 rounded bg-gray-200" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        {backLink}
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center font-medium text-red-700">
          {error}
        </div>
      </div>
    )
  }

  const available = book.availableCopies > 0

  return (
    <div>
      {backLink}
      <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm md:flex">
        <div className="flex h-56 items-center justify-center bg-indigo-50 text-8xl font-bold text-indigo-400 md:h-auto md:w-64">
          {book.title.charAt(0)}
        </div>
        <div className="flex-1 space-y-4 p-6">
          <div>
            <h1 className="text-3xl font-bold">{book.title}</h1>
            <p className="mt-1 text-lg text-gray-600">by {book.author}</p>
          </div>

          <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
            {book.genre?.name}
          </span>

          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500">ISBN</dt>
              <dd className="font-medium">{book.isbn}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Total copies</dt>
              <dd className="font-medium">{book.totalCopies}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Available copies</dt>
              <dd className="font-medium">{book.availableCopies}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Status</dt>
              <dd
                className={`inline-block rounded-full px-2 py-1 font-medium ${
                  available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {available ? 'Available to borrow' : 'Currently unavailable'}
              </dd>
            </div>
          </dl>
         <ReadingListButton book={book} />
        </div>
      </article>
    </div>
  )
}

export default BookDetail