import { Link, Route, Routes } from 'react-router-dom'
import { ReadingListProvider } from './context/ReadingListContext.jsx'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import HomePage from './pages/HomePage.jsx'
import BookDetail from './pages/BookDetail.jsx'
import ReadingListPage from './pages/ReadingListPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import SpaceBookingPage from './pages/SpaceBookingPage.jsx'

function App() {
  return (
    <ReadingListProvider>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar />

        <main className="mx-auto max-w-6xl px-4 py-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/books/:id" element={<BookDetail />} />
            <Route path="/reading-list" element={<ReadingListPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/book-space"
              element={
                <ProtectedRoute>
                  <SpaceBookingPage />
                </ProtectedRoute>
              }
            />
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
    </ReadingListProvider>
  )
}

export default App