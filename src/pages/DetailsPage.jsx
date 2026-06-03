import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { getMovieDetails } from '../services/api'
import Loader from '../Components/Loader'
import { FaHeart, FaRegHeart, FaStar, FaArrowLeft, FaClock, FaCalendarAlt, FaGlobe, FaTrophy, FaBookmark, FaRegBookmark } from 'react-icons/fa'
import { favorites as favStorage, watchlist as wlStorage } from '../services/storage'
import { useAuth } from '../context/AuthContext'

function RatingBadge({ source, value }) {
  const colors = {
    'Internet Movie Database': 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
    'Rotten Tomatoes': 'border-red-500/30 bg-red-500/10 text-red-400',
    'Metacritic': 'border-green-500/30 bg-green-500/10 text-green-400',
  }
  const color = colors[source] || 'border-slate-600 bg-slate-800 text-slate-300'

  const label = source === 'Internet Movie Database' ? 'IMDb' : source

  return (
    <div className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl border ${color}`}>
      <span className="text-xs font-medium opacity-70 text-center">{label}</span>
      <span className="text-lg font-extrabold">{value}</span>
    </div>
  )
}

function DetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isFav, setIsFav] = useState(false)
  const [isWatchlisted, setIsWatchlisted] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const data = await getMovieDetails(id)
      if (data.error) {
        setError(data.error)
      } else {
        setMovie(data)
        setIsFav(favStorage.has(data.imdbID))
        setIsWatchlisted(wlStorage.has(data.imdbID))
      }
      setLoading(false)
    }
    load()
  }, [id])

  function cardData() {
    return {
      imdbID: movie.imdbID,
      Title: movie.Title,
      Year: movie.Year,
      Poster: movie.Poster,
      Type: movie.Type,
      imdbRating: movie.imdbRating,
    }
  }

  function toggleFavorite() {
    if (!movie) return
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`)
      return
    }
    const nowIn = favStorage.toggle(cardData())
    setIsFav(nowIn)
  }

  function toggleWatchlist() {
    if (!movie) return
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`)
      return
    }
    const nowIn = wlStorage.toggle(cardData())
    setIsWatchlisted(nowIn)
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader size="lg" text="Loading movie details..." />
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 text-center px-6">
        <div className="text-6xl">😢</div>
        <p className="text-slate-300 text-xl font-semibold">{error || 'Movie not found'}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-full font-semibold transition-all duration-200 cursor-pointer"
        >
          Back to Home
        </button>
      </div>
    )
  }

  const poster =
    movie.Poster && movie.Poster !== 'N/A'
      ? movie.Poster
      : 'https://placehold.co/400x600/1e293b/64748b?text=No+Image'

  const genres = movie.Genre ? movie.Genre.split(', ') : []

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-orange-400 transition-colors duration-200 cursor-pointer group"
        >
          <FaArrowLeft className="transition-transform duration-200 group-hover:-translate-x-1" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Poster */}
          <div className="flex-shrink-0">
            <div className="w-full max-w-xs mx-auto lg:mx-0 lg:w-72 xl:w-80">
              <img
                src={poster}
                alt={movie.Title}
                className="w-full rounded-2xl shadow-2xl shadow-black/60 border border-slate-800"
              />
              {/* Favorites button */}
              <button
                onClick={toggleFavorite}
                className={`mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 cursor-pointer border ${
                  isFav
                    ? 'bg-orange-600/20 border-orange-500/50 text-orange-400 hover:bg-orange-600/30'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-orange-500/50 hover:text-orange-400'
                }`}
              >
                {isFav ? <FaHeart className="text-orange-500" /> : <FaRegHeart />}
                {isFav ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
              {/* Watchlist button */}
              <button
                onClick={toggleWatchlist}
                className={`mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 cursor-pointer border ${
                  isWatchlisted
                    ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-400 hover:bg-indigo-600/30'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-indigo-500/50 hover:text-indigo-400'
                }`}
              >
                {isWatchlisted ? <FaBookmark className="text-indigo-400" /> : <FaRegBookmark />}
                {isWatchlisted ? 'In My Watchlist' : 'Add to Watchlist'}
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            {/* Title & year */}
            <div className="flex flex-wrap items-center gap-3 mb-2">
              {movie.Rated && movie.Rated !== 'N/A' && (
                <span className="text-xs px-2 py-0.5 rounded border border-slate-600 text-slate-400 font-mono">{movie.Rated}</span>
              )}
              <span className="capitalize text-xs px-2 py-0.5 rounded-full bg-indigo-600/30 text-indigo-400 font-semibold">{movie.Type}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white mb-1 leading-tight">
              {movie.Title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm mt-3 mb-6">
              {movie.Year && (
                <span className="flex items-center gap-1.5">
                  <FaCalendarAlt className="text-xs" /> {movie.Year}
                </span>
              )}
              {movie.Runtime && movie.Runtime !== 'N/A' && (
                <span className="flex items-center gap-1.5">
                  <FaClock className="text-xs" /> {movie.Runtime}
                </span>
              )}
              {movie.Language && movie.Language !== 'N/A' && (
                <span className="flex items-center gap-1.5">
                  <FaGlobe className="text-xs" /> {movie.Language}
                </span>
              )}
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {genres.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 text-xs font-semibold rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            {/* Ratings */}
            {movie.Ratings && movie.Ratings.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-6">
                {movie.Ratings.map((r) => (
                  <RatingBadge key={r.Source} source={r.Source} value={r.Value} />
                ))}
              </div>
            )}

            {/* IMDb stars */}
            {movie.imdbRating && movie.imdbRating !== 'N/A' && (
              <div className="flex items-center gap-2 mb-6">
                <FaStar className="text-yellow-400 text-xl" />
                <span className="text-2xl font-extrabold text-yellow-400">{movie.imdbRating}</span>
                <span className="text-slate-500 text-sm">/ 10</span>
                {movie.imdbVotes && movie.imdbVotes !== 'N/A' && (
                  <span className="text-slate-500 text-sm ml-1">({movie.imdbVotes} votes)</span>
                )}
              </div>
            )}

            {/* Plot */}
            {movie.Plot && movie.Plot !== 'N/A' && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-2">Plot</h3>
                <p className="text-slate-200 leading-relaxed text-base">{movie.Plot}</p>
              </div>
            )}

            {/* Credits grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {movie.Director && movie.Director !== 'N/A' && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Director</p>
                  <p className="text-white text-sm font-medium">{movie.Director}</p>
                </div>
              )}
              {movie.Writer && movie.Writer !== 'N/A' && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Writer</p>
                  <p className="text-white text-sm font-medium">{movie.Writer}</p>
                </div>
              )}
              {movie.Actors && movie.Actors !== 'N/A' && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Cast</p>
                  <p className="text-white text-sm font-medium">{movie.Actors}</p>
                </div>
              )}
              {movie.BoxOffice && movie.BoxOffice !== 'N/A' && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Box Office</p>
                  <p className="text-white text-sm font-medium">{movie.BoxOffice}</p>
                </div>
              )}
            </div>

            {/* Awards */}
            {movie.Awards && movie.Awards !== 'N/A' && (
              <div className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                <FaTrophy className="text-yellow-400 mt-0.5 flex-shrink-0" />
                <p className="text-yellow-200 text-sm leading-relaxed">{movie.Awards}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailsPage
