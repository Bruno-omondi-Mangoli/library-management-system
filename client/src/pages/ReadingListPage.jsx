import { Link } from 'react-router-dom'
import { useReadingList } from '../context/ReadingListContext.jsx'

function ReadingListPage() {
  const { readingList, dispatch } = useReadingList()

  if (readingList.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
        <p className="font-medium">Your reading list is empty</p>
        <p className="mt-1 text-sm text-gray-600">
          Browse the catalog and add books you want to read.
        </p>
        <Link to="/" className="mt-4 inline-block text-indigo-600 hover:underline">
          Go to the catalog
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Reading list ({readingList.length})
        </h1>
        <button
          onClick={() => dispatch({ type: 'CLEAR_LIST' })}
          className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
        >
          Clear list
        </button>
      </div>

      <ul className="space-y-3">
        {readingList.map((book) => (
          <li
            key={book.id}
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div>
              <Link
                to={`/books/${book.id}`}
                className="font-semibold text-indigo-700 hover:underline"
              >
                {book.title}
              </Link>
              <p className="text-sm text-gray-600">
                by {book.author}
                {book.genre && ` · ${book.genre}`}
              </p>
            </div>
            <button
              onClick={() => dispatch({ type: 'REMOVE_BOOK', payload: book.id })}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ReadingListPage