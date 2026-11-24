import { Link, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import BookDetail from './pages/BookDetail.jsx'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center px-4 py-4">
          <Link to="/" className="text-xl font-bold text-indigo-600">
            📚 Library Catalog
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route
            path="*"
            element={
              <div className="py-16 text-center">
                <h1 className="text-2xl font-semibold">Page not found</h1>
                <Link to="/" className="mt-4 inline-block text-indigo-600 hover:underline">
                  Back to the catalog
                </Link>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  )
}

export default App