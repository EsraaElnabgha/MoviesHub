import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, Link, useLocation, useSearchParams } from 'react-router-dom'
import { FaHeart, FaSearch, FaFilm, FaTv } from 'react-icons/fa'
import { searchMovies } from '../services/api'

// Debounce hook
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const searchRef = useRef(null)

  const debouncedQuery = useDebounce(searchQuery, 350)

  // Fetch autocomplete suggestions
  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    let cancelled = false
    async function fetchSuggestions() {
      setLoadingSuggestions(true)
      const result = await searchMovies(debouncedQuery.trim(), '', 1)
      if (!cancelled) {
        setSuggestions((result.movies || []).slice(0, 7))
        setShowSuggestions(true)
        setLoadingSuggestions(false)
      }
    }
    fetchSuggestions()
    return () => { cancelled = true }
  }, [debouncedQuery])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleNavSearch(e) {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setShowSuggestions(false)
      setMobileMenuOpen(false)
    }
  }

  function handleSuggestionClick(movie) {
    navigate(`/movie/${movie.imdbID}`)
    setSearchQuery('')
    setShowSuggestions(false)
  }

  // Active link helpers
  const isActivePath = (path) => location.pathname === path
  const isActiveType = (type) => location.pathname === '/' && searchParams.get('type') === type
  const isHomeClean = location.pathname === '/' && !searchParams.get('q') && !searchParams.get('type')

  const TypeIcon = ({ type }) =>
    type === 'movie' ? <FaFilm className="text-indigo-400 text-xs flex-shrink-0" /> : <FaTv className="text-emerald-400 text-xs flex-shrink-0" />

  return (
    <nav className="fixed top-0 left-0 w-full bg-slate-950/60 backdrop-blur-md border-b border-white/5 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between gap-4">

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {!mobileMenuOpen ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="h-6 w-6">
                  <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="h-6 w-6">
                  <path d="M6 18 18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>

          {/* Logo + Nav links */}
          <div className="flex flex-1 items-center justify-center sm:justify-start gap-6">
            <Link to="/" className="flex-shrink-0">
              <img src="/logo.svg" alt="Movies Hub" className="h-10 w-auto" />
            </Link>

            {/* Desktop nav links */}
            <div className="hidden sm:flex items-center gap-1">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isHomeClean ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Home
              </Link>
              <Link
                to="/?type=movie"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActiveType('movie') ? 'text-indigo-400 bg-indigo-500/10' : 'text-gray-300 hover:text-indigo-400 hover:bg-white/5'
                }`}
              >
                <FaFilm className="text-xs" />
                Movies
              </Link>
              <Link
                to="/?type=series"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActiveType('series') ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-300 hover:text-emerald-400 hover:bg-white/5'
                }`}
              >
                <FaTv className="text-xs" />
                TV Series
              </Link>
              <Link
                to="/favorites"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActivePath('/favorites') ? 'text-orange-400 bg-orange-500/10' : 'text-gray-300 hover:text-orange-400 hover:bg-white/5'
                }`}
              >
                <FaHeart className="text-xs" />
                Favorites
              </Link>
            </div>
          </div>

          {/* Search bar with Autocomplete — desktop */}
          <div ref={searchRef} className="hidden md:flex flex-1 max-w-xs items-center relative">
            <form onSubmit={handleNavSearch} className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                {loadingSuggestions ? (
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-600 border-t-orange-500 animate-spin" />
                ) : (
                  <FaSearch className="w-3.5 h-3.5 text-gray-400" />
                )}
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value) }}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Quick search..."
                autoComplete="off"
                className="block w-full pl-9 pr-3 py-1.5 bg-slate-950/40 border border-white/10 rounded-full text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-slate-950/80 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-200"
              />
            </form>

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-50">
                {suggestions.map((movie) => {
                  const poster = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : null
                  return (
                    <button
                      key={movie.imdbID}
                      onClick={() => handleSuggestionClick(movie)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors duration-150 text-left cursor-pointer"
                    >
                      {/* Mini poster */}
                      <div className="w-8 h-12 rounded-md overflow-hidden bg-slate-800 flex-shrink-0">
                        {poster ? (
                          <img src={poster} alt={movie.Title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600">
                            <FaFilm className="text-xs" />
                          </div>
                        )}
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{movie.Title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-slate-500 text-xs">{movie.Year}</span>
                          <TypeIcon type={movie.Type} />
                          <span className="text-slate-600 text-xs capitalize">{movie.Type}</span>
                        </div>
                      </div>
                    </button>
                  )
                })}
                {/* See all results */}
                <button
                  onClick={handleNavSearch}
                  className="w-full px-3 py-2.5 text-xs text-orange-400 hover:bg-orange-500/10 transition-colors duration-150 font-semibold border-t border-slate-800 text-center cursor-pointer"
                >
                  See all results for "{searchQuery}" →
                </button>
              </div>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Notification bell */}
            <button
              type="button"
              className="p-1.5 rounded-full text-gray-400 hover:text-white transition-colors duration-200 hidden sm:block"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="h-5 w-5">
                <path d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="p-1.5 rounded-full text-gray-400 hover:text-white transition-colors duration-200"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              {profileOpen && (
                <div className="absolute right-0 z-50 mt-2 w-44 rounded-xl bg-slate-900 border border-slate-800 py-1 shadow-xl">
                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors duration-150"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    My Profile
                  </Link>
                  <Link
                    to="/favorites"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors duration-150"
                  >
                    <FaHeart className="w-4 h-4 text-orange-400" />
                    Favorites
                  </Link>
                  <hr className="border-slate-800 my-1" />
                  <a href="#" className="block px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors duration-150">Sign out</a>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-slate-950/95 backdrop-blur-md border-t border-white/5 px-4 py-3 space-y-1">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className={`block px-3 py-2 rounded-md text-sm font-medium ${isHomeClean ? 'text-white bg-white/10' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>Home</Link>
          <Link to="/?type=movie" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${isActiveType('movie') ? 'text-indigo-400 bg-indigo-500/10' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
            <FaFilm className="text-xs" /> Movies
          </Link>
          <Link to="/?type=series" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${isActiveType('series') ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
            <FaTv className="text-xs" /> TV Series
          </Link>
          <Link to="/favorites" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-orange-400 hover:bg-white/5">
            <FaHeart className="text-xs" /> Favorites
          </Link>

          {/* Mobile search */}
          <form onSubmit={handleNavSearch} className="pt-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSearch className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies..."
                className="block w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-full text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-orange-500"
              />
            </div>
          </form>
        </div>
      )}
    </nav>
  )
}

export default Navbar