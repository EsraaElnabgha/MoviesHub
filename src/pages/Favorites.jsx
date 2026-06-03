import { useState, useEffect } from 'react'
import { FaHeart } from 'react-icons/fa'
import MovieCard from '../Components/MovieCard'

const FAVORITES_KEY = 'moviesHubFavorites'

function Favorites() {
  const [favorites, setFavorites] = useState([])

  function load() {
    try {
      const data = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || []
      setFavorites(data)
    } catch {
      setFavorites([])
    }
  }

  useEffect(() => {
    load()
    // Re-load when storage changes in another tab
    window.addEventListener('storage', load)
    return () => window.removeEventListener('storage', load)
  }, [])

  function clearAll() {
    localStorage.removeItem(FAVORITES_KEY)
    setFavorites([])
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <FaHeart className="text-orange-500" />
              My Favorites
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {favorites.length === 0
                ? 'No favorites saved yet'
                : `${favorites.length} movie${favorites.length > 1 ? 's' : ''} saved`}
            </p>
          </div>
          {favorites.length > 0 && (
            <button
              onClick={clearAll}
              className="px-4 py-2 text-sm font-semibold text-red-400 border border-red-500/30 bg-red-500/10 rounded-full hover:bg-red-500/20 transition-all duration-200 cursor-pointer"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Content */}
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-7xl mb-6 opacity-20">
              <FaHeart />
            </div>
            <h3 className="text-xl font-semibold text-slate-400 mb-2">No favorites yet</h3>
            <p className="text-slate-600 text-sm">
              Browse movies and click the ❤️ icon to save them here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {favorites.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Favorites
