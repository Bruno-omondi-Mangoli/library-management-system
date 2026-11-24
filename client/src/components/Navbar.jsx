import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useReadingList } from '../context/ReadingListContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

function Navbar() {
  const { readingList } = useReadingList()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const linkClasses = ({ isActive }) =>
    `rounded-md px-3 py-2 text-sm font-medium ${
      isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
    }`

  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-3">
        <Link to="/" className="mr-4 text-xl font-bold text-indigo-600">
          📚 Library Catalog
        </Link>

        <NavLink to="/" end className={linkClasses}>
          Catalog
        </NavLink>

        <NavLink to="/reading-list" className={linkClasses}>
          Reading List
          <span
            aria-label={`${readingList.length} books in your reading list`}
            className="ml-2 rounded-full bg-indigo-600 px-2 py-0.5 text-xs text-white"
          >
            {readingList.length}
          </span>
        </NavLink>

        <NavLink to="/book-space" className={linkClasses}>
          Book a Space
        </NavLink>

        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <>
              <span className="text-sm text-gray-600">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClasses}>
                Log in
              </NavLink>
              <Link
                to="/register"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar