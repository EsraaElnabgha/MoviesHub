import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { FaHeart, FaRegHeart, FaStar, FaBookmark, FaRegBookmark } from 'react-icons/fa'
import { favorites, watchlist } from '../services/storage'
import { useAuth } from '../context/AuthContext'

function MovieCard({ movie }) {
  const navigate = useNavigate()
  const [isFav, setIsFav] = useState(false)
  const [isWatchlisted, setIsWatchlisted] = useState(false)

  useEffect(() => {
    setIsFav(favorites.has(movie.imdbID))
    setIsWatchlisted(watchlist.has(movie.imdbID))
  }, [movie.imdbID])

  const { user } = useAuth()
  const location = useLocation()

  function toggleFavorite(e) {
    e.stopPropagation()
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`)
      return
    }
    const nowIn = favorites.toggle(movie)
    setIsFav(nowIn)
  }

  function toggleWatchlist(e) {
    e.stopPropagation()
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`)
      return
    }
    const nowIn = watchlist.toggle(movie)
    setIsWatchlisted(nowIn)
  }


  const poster =
    movie.Poster && movie.Poster !== 'N/A'
      ? movie.Poster
      : 'https://placehold.co/300x445/1e293b/64748b?text=No+Image'

  const typeBadgeColor =
    movie.Type === 'movie'
      ? 'bg-indigo-600/80'
      : movie.Type === 'series'
      ? 'bg-emerald-600/80'
      : 'bg-slate-600/80'

  return (
    <div
      onClick={() => navigate(`/movie/${movie.imdbID}`)}
      className="group relative bg-slate-900 rounded-2xl overflow-hidden cursor-pointer border border-slate-800 hover:border-orange-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-900/20 hover:-translate-y-1"
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden bg-slate-800">
        <img
          src={poster}
          alt={movie.Title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Action buttons (heart + bookmark) */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <button
            onClick={toggleFavorite}
            className="p-2 rounded-full bg-slate-950/70 backdrop-blur-sm text-white hover:scale-110 transition-all duration-200"
            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFav ? (
              <FaHeart className="text-orange-500 text-sm" />
            ) : (
              <FaRegHeart className="text-gray-300 text-sm" />
            )}
          </button>
          <button
            onClick={toggleWatchlist}
            className="p-2 rounded-full bg-slate-950/70 backdrop-blur-sm text-white hover:scale-110 transition-all duration-200"
            title={isWatchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            {isWatchlisted ? (
              <FaBookmark className="text-indigo-400 text-sm" />
            ) : (
              <FaRegBookmark className="text-gray-300 text-sm" />
            )}
          </button>
        </div>

        {/* Type badge */}
        <span
          className={`absolute top-3 left-3 text-xs font-semibold px-2 py-0.5 rounded-full text-white ${typeBadgeColor} backdrop-blur-sm capitalize`}
        >
          {movie.Type || 'N/A'}
        </span>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-white font-semibold text-sm leading-tight line-clamp-2 group-hover:text-orange-400 transition-colors duration-200">
          {movie.Title}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-slate-400 text-xs">{movie.Year}</span>
          {movie.imdbRating && movie.imdbRating !== 'N/A' && (
            <span className="flex items-center gap-1 text-xs text-yellow-400 font-medium">
              <FaStar className="text-yellow-500 text-xs" />
              {movie.imdbRating}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default MovieCard
