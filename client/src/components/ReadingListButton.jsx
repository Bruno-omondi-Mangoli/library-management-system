import { toReadingListItem, useReadingList } from '../context/ReadingListContext.jsx'

function ReadingListButton({ book }) {
  const { readingList, dispatch } = useReadingList()
  const inList = readingList.some((b) => b.id === book.id)

  const handleClick = () => {
    if (inList) {
      dispatch({ type: 'REMOVE_BOOK', payload: book.id })
    } else {
      dispatch({ type: 'ADD_BOOK', payload: toReadingListItem(book) })
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
        inList
          ? 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100'
          : 'border-indigo-300 bg-white text-indigo-700 hover:bg-indigo-50'
      }`}
    >
      {inList ? '✓ In reading list (click to remove)' : '+ Add to reading list'}
    </button>
  )
}

export default ReadingListButton