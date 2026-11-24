import { createContext, useContext, useEffect, useReducer } from 'react'
import { useAuth } from './AuthContext.jsx'

const ReadingListContext = createContext(null)

const GUEST_KEY = 'readingList:guest'

// Store only what the reading list page needs, not the whole book object
export function toReadingListItem(book) {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    genre: book.genre?.name ?? '',
  }
}

// Every way the list is allowed to change lives in this one function
function readingListReducer(state, action) {
  switch (action.type) {
    case 'ADD_BOOK':
      if (state.some((b) => b.id === action.payload.id)) return state
      return [...state, action.payload]
    case 'REMOVE_BOOK':
      return state.filter((b) => b.id !== action.payload)
    case 'CLEAR_LIST':
      return []
    default:
      return state
  }
}

// Restore a saved list from localStorage (empty list if missing or corrupt)
function loadList(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key))
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function ReadingListStore({ storageKey, children }) {
  const [readingList, dispatch] = useReducer(
    readingListReducer,
    storageKey,
    (key) => {
      const saved = loadList(key)
      if (key === GUEST_KEY) return saved

      // Logged-in user: merge any guest list into the account's list
      const merged = [...saved]
      loadList(GUEST_KEY).forEach((book) => {
        if (!merged.some((b) => b.id === book.id)) merged.push(book)
      })
      return merged
    },
  )

  // Persist: save the list to localStorage every time it changes
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(readingList))
  }, [readingList, storageKey])

  // Once merged into an account, the guest list is no longer needed
  useEffect(() => {
    if (storageKey !== GUEST_KEY) localStorage.removeItem(GUEST_KEY)
  }, [storageKey])

  return (
    <ReadingListContext.Provider value={{ readingList, dispatch }}>
      {children}
    </ReadingListContext.Provider>
  )
}

export function ReadingListProvider({ children }) {
  const { user } = useAuth()
  const storageKey = user ? `readingList:user:${user.id}` : GUEST_KEY

  // The key makes React load the right saved list when the user logs in or out
  return (
    <ReadingListStore key={storageKey} storageKey={storageKey}>
      {children}
    </ReadingListStore>
  )
}

export function useReadingList() {
  const ctx = useContext(ReadingListContext)
  if (!ctx) throw new Error('useReadingList must be used inside <ReadingListProvider>')
  return ctx
}