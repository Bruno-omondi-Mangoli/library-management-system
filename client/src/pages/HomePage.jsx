import { useEffect, useState } from 'react'
import axios from 'axios'
import SearchBar from '../components/SearchBar.jsx'
import BookGrid from '../components/BookGrid.jsx'

function HomePage() {
  // Shared filter state lives here, in the lowest common parent
  const [search, setSearch] = useState('')
  const [genreId, setGenreId] = useState('')
  const [sort, setSort] = useState('title-asc')

  const [genres, setGenres] = useState([])
  const [genresError, setGenresError] = useState(false)

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/genres`)
      .then((res) => setGenres(res.data))
      .catch((err) => {
        console.error(err)
        setGenresError(true)
      })
  }, [])

  const selectClasses =
    'rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200'

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Browse the catalog</h1>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <SearchBar onSearch={setSearch} />

        <div>
          <label htmlFor="genre" className="sr-only">
            Filter by genre
          </label>
          <select
            id="genre"
            value={genreId}
            onChange={(e) => setGenreId(e.target.value)}
            className={selectClasses}
          >
            <option value="">All genres</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="sort" className="sr-only">
            Sort books
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className={selectClasses}
          >
            <option value="title-asc">Title (A to Z)</option>
            <option value="title-desc">Title (Z to A)</option>
            <option value="author-asc">Author (A to Z)</option>
            <option value="author-desc">Author (Z to A)</option>
          </select>
        </div>
      </div>

      {genresError && (
        <p className="mb-4 text-sm text-amber-700">
          Genres could not be loaded, so the genre filter is unavailable.
        </p>
      )}

      <BookGrid genreId={genreId} search={search} sort={sort} />
    </div>
  )
}

export default HomePage