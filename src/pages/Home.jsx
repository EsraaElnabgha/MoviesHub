import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchMovies } from '../services/api'
import MovieCard from '../Components/MovieCard'
import Loader from '../Components/Loader'

const CATEGORIES = [
  { label: 'All', value: '' },
  { label: 'Movies', value: 'movie' },
  { label: 'Series', value: 'series' },
]

const DEFAULT_QUERY = 'marvel'

function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryParam = searchParams.get('q') || ''
  const typeParam = searchParams.get('type') || ''

  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [loadingMore, setLoadingMore] = useState(false)

  const activeQuery = queryParam || DEFAULT_QUERY

  const fetchMovies = useCallback(async (query, type, pageNum, append = false) => {
    if (pageNum === 1) setLoading(true)
    else setLoadingMore(true)
    setError('')

    const result = await searchMovies(query, type, pageNum)

    if (result.error) {
      setError(result.error)
      setMovies([])
      setTotalResults(0)
    } else {
      setMovies((prev) => (append ? [...prev, ...result.movies] : result.movies))
      setTotalResults(result.totalResults)
    }

    setLoading(false)
    setLoadingMore(false)
  }, [])

  // Fetch when query or type changes
  useEffect(() => {
    setPage(1)
    fetchMovies(activeQuery, typeParam, 1, false)
  }, [activeQuery, typeParam, fetchMovies])

  function handleTypeChange(type) {
    const params = {}
    if (queryParam) params.q = queryParam
    if (type) params.type = type
    setSearchParams(params)
  }

  function handleLoadMore() {
    const nextPage = page + 1
    setPage(nextPage)
    fetchMovies(activeQuery, typeParam, nextPage, true)
  }

  const hasMore = movies.length < totalResults

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Page container — top padding accounts for fixed navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {queryParam
                ? <>Results for <span className="text-orange-400">"{queryParam}"</span></>
                : <span className="text-orange-400">Trending Movies</span>}
            </h2>
            {totalResults > 0 && (
              <p className="text-slate-400 text-sm mt-1">{totalResults.toLocaleString()} results found</p>
            )}
          </div>

          {/* Category tabs */}
          <div className="flex gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleTypeChange(cat.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  typeParam === cat.value
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-900/40'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <Loader size="lg" text="Fetching movies..." />
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">🎬</div>
            <p className="text-slate-400 text-lg">{error}</p>
            <p className="text-slate-600 text-sm mt-2">Try a different search term</p>
          </div>
        ) : movies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-slate-400 text-lg">No results found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {movies.map((movie) => (
                <MovieCard key={movie.imdbID} movie={movie} />
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-8 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-orange-500/40 text-white font-semibold rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loadingMore ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 rounded-full border-2 border-slate-600 border-t-orange-500 animate-spin" />
                      Loading...
                    </span>
                  ) : (
                    `Load More (${totalResults - movies.length} remaining)`
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Home
