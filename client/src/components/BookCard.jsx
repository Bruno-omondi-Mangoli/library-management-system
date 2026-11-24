import { Link } from 'react-router-dom'
import ReadingListButton from './ReadingListButton.jsx'

function BookCard({ book }) {
  const available = book.availableCopies > 0

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <Link to={`/books/${book.id}`} className="flex flex-1 flex-col">
        <div className="flex h-36 items-center justify-center bg-indigo-50 text-5xl font-bold text-indigo-400">
          {book.title.charAt(0)}
        </div>
        <div className="flex flex-1 flex-col gap-1 p-4 pb-2">
          <h2 className="line-clamp-2 font-semibold leading-snug">{book.title}</h2>
          <p className="text-sm text-gray-600">by {book.author}</p>
          <div className="mt-auto flex items-center justify-between pt-3 text-xs">
            <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-700">
              {book.genre?.name}
            </span>
            <span
              className={`rounded-full px-2 py-1 font-medium ${
                available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {available ? `${book.availableCopies} available` : 'Unavailable'}
            </span>
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <ReadingListButton book={book} />
      </div>
    </div>
  )
}

export default BookCard