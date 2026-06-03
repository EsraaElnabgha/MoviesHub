import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchMovies } from '../services/api'
import { FaStar } from 'react-icons/fa'

// List of queries to pull a variety of featured movies from
const FEATURED_QUERIES = ['marvel', 'batman', 'star wars', 'james bond', 'fast furious']

function CarouselItem({ movie }) {
  const navigate = useNavigate()

  const poster =
    movie.Poster && movie.Poster !== 'N/A'
      ? movie.Poster
      : null

  if (!poster) return null

  return (
    <div
      onClick={() => navigate(`/movie/${movie.imdbID}`)}
      className="flex-shrink-0 w-36 sm:w-44 cursor-pointer group relative rounded-xl overflow-hidden border border-white/5 hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/60"
      style={{ aspectRatio: '2/3' }}
    >
      <img
        src={poster}
        alt={movie.Title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        draggable={false}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {/* Info on hover */}
      <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <p className="text-white text-xs font-semibold line-clamp-2 leading-tight">{movie.Title}</p>
        <p className="text-slate-400 text-xs mt-0.5">{movie.Year}</p>
      </div>
    </div>
  )
}

function AutoCarousel() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const trackRef = useRef(null)

  useEffect(() => {
    async function fetchFeatured() {
      setLoading(true)
      const results = []

      for (const q of FEATURED_QUERIES) {
        const data = await searchMovies(q, 'movie', 1)
        if (data.movies && data.movies.length > 0) {
          // Only include movies with actual posters
          const withPosters = data.movies.filter(m => m.Poster && m.Poster !== 'N/A')
          results.push(...withPosters.slice(0, 6))
        }
        if (results.length >= 30) break
      }

      setMovies(results.slice(0, 30))
      setLoading(false)
    }
    fetchFeatured()
  }, [])

  if (loading) {
    return (
      <div className="w-full py-8 flex items-center justify-center gap-3">
        <div className="h-5 w-5 rounded-full border-2 border-slate-700 border-t-orange-500 animate-spin" />
        <span className="text-slate-500 text-sm">Loading featured movies…</span>
      </div>
    )
  }

  if (movies.length === 0) return null

  // Duplicate movies for a seamless infinite loop
  const loopedMovies = [...movies, ...movies]

  return (
    <section className="w-full bg-slate-950 py-8 overflow-hidden">
      {/* Section header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-5">
        <div className="flex items-center gap-3">
          <span className="w-1 h-6 rounded-full bg-orange-500 block" />
          <h2 className="text-lg font-bold text-white tracking-tight">Featured Movies</h2>
          <FaStar className="text-yellow-400 text-sm ml-1" />
        </div>
      </div>

      {/* Carousel track */}
      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

        <div
          ref={trackRef}
          className="flex gap-3 sm:gap-4"
          style={{
            animation: `carousel-scroll 40s linear infinite`,
            animationPlayState: isPaused ? 'paused' : 'running',
            width: 'max-content',
          }}
        >
          {loopedMovies.map((movie, index) => (
            <CarouselItem key={`${movie.imdbID}-${index}`} movie={movie} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes carousel-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}

export default AutoCarousel
