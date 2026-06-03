import { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { FaHeart, FaBookmark, FaTrash, FaUserCircle, FaFilm, FaList, FaCheck, FaTimes } from 'react-icons/fa'
import { RiMovie2AiLine } from 'react-icons/ri'
import { favorites as favStorage, watchlist as wlStorage } from '../services/storage'
import { useAuth } from '../context/AuthContext'
import { AVATAR_GRADIENTS } from '../services/auth'
import MovieCard from '../Components/MovieCard'

const TABS = [
  {
    id: 'favorites',
    label: 'Favorites',
    icon: FaHeart,
    activeClass: 'bg-orange-500 text-white shadow-lg shadow-orange-900/40',
    inactiveClass: 'text-slate-400 hover:text-white hover:bg-slate-800',
  },
  {
    id: 'watchlist',
    label: 'My Watchlist',
    icon: FaBookmark,
    activeClass: 'bg-indigo-500 text-white shadow-lg shadow-indigo-900/40',
    inactiveClass: 'text-slate-400 hover:text-white hover:bg-slate-800',
  },
]

function StatCard({ icon: Icon, label, value, gradient }) {
  return (
    <div className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: gradient }}
      >
        <Icon className="text-white text-lg" />
      </div>
      <div>
        <p className="text-3xl font-extrabold text-white leading-none">{value}</p>
        <p className="text-slate-500 text-xs mt-1 font-medium">{label}</p>
      </div>
      {/* Decorative glow */}
      <div
        className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full opacity-10 blur-xl"
        style={{ background: gradient }}
      />
    </div>
  )
}

function EmptyState({ tab }) {
  const isFav = tab === 'favorites'
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center mb-6 opacity-20"
        style={{
          background: isFav
            ? 'linear-gradient(135deg, rgba(246,120,0,1), rgba(255,193,40,1))'
            : 'linear-gradient(135deg, #6366f1, #818cf8)',
        }}
      >
        {isFav ? <FaHeart className="text-white text-4xl" /> : <FaBookmark className="text-white text-4xl" />}
      </div>
      <h3 className="text-lg font-semibold text-slate-300 mb-2">
        {isFav ? 'No favorites yet' : 'Your watchlist is empty'}
      </h3>
      <p className="text-slate-600 text-sm mb-6 max-w-xs">
        {isFav
          ? 'Click the ❤️ icon on any movie card to save it here'
          : 'Click the 🔖 icon on any movie card to add it here'}
      </p>
      <Link
        to="/"
        className="px-6 py-2.5 rounded-full text-sm font-semibold text-white border border-slate-700 bg-slate-800 hover:bg-slate-700 transition-all duration-200"
      >
        Browse Movies
      </Link>
    </div>
  )
}

function Profile() {
  const { user, updateProfile } = useAuth()
  const [activeTab, setActiveTab] = useState('favorites')
  const [favMovies, setFavMovies] = useState([])
  const [wlMovies, setWlMovies] = useState([])

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editDisplayName, setEditDisplayName] = useState('')
  const [editGradient, setEditGradient] = useState('')
  const [modalError, setModalError] = useState('')

  // Route guard: Redirect if not logged in
  if (!user) {
    return <Navigate to="/login?redirect=/profile" replace />
  }

  function reload() {
    setFavMovies(favStorage.getAll())
    setWlMovies(wlStorage.getAll())
  }

  useEffect(() => {
    reload()
    window.addEventListener('storage', reload)
    window.addEventListener('authChange', reload)
    return () => {
      window.removeEventListener('storage', reload)
      window.removeEventListener('authChange', reload)
    }
  }, [])

  useEffect(() => { reload() }, [activeTab])

  // Get initials for profile avatar
  const getInitials = (name) => {
    if (!name) return ''
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  function openEditModal() {
    setEditDisplayName(user.displayName)
    setEditGradient(user.avatarGradient)
    setModalError('')
    setIsEditModalOpen(true)
  }

  function handleSaveProfile(e) {
    e.preventDefault()
    setModalError('')

    if (!editDisplayName.trim()) {
      setModalError('Display name is required.')
      return
    }

    const res = updateProfile(editDisplayName, editGradient)
    if (res.success) {
      setIsEditModalOpen(false)
    } else {
      setModalError(res.error)
    }
  }

  function clearCurrent() {
    const listKey = activeTab === 'favorites' 
      ? `moviesHubFavorites_${user.username}` 
      : `moviesHubWatchlist_${user.username}`
    
    localStorage.removeItem(listKey)
    reload()
  }

  const activeMovies = activeTab === 'favorites' ? favMovies : wlMovies

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ── Hero Banner ── */}
      <div className="relative w-full h-52 overflow-hidden">
        {/* Background gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #12172b 100%)',
          }}
        />
        {/* Glowing orbs */}
        <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-orange-600/10 blur-3xl -translate-x-1/3 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-indigo-700/10 blur-3xl translate-x-1/4 translate-y-1/3" />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-950 to-transparent" />
      </div>

      {/* ── Profile Card ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Avatar + Info Row — floats over the banner bottom */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-16 relative z-10">

          {/* Avatar */}
          <div
            className="w-28 h-28 rounded-2xl flex items-center justify-center font-black text-white text-4xl flex-shrink-0 border-4 border-slate-950 shadow-2xl shadow-black/60 transition-all duration-300"
            style={{ background: user.avatarGradient }}
          >
            {getInitials(user.displayName)}
          </div>

          {/* Name & meta */}
          <div className="flex flex-1 flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pb-1">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">{user.displayName}</h1>
              <p className="text-slate-500 text-sm mt-0.5">@{user.username} · Member since {new Date(user.createdAt || Date.now()).getFullYear()}</p>
            </div>
            <button
              onClick={openEditModal}
              className="self-start sm:self-auto px-5 py-2 text-sm font-semibold text-slate-300 border border-slate-700 bg-slate-900 rounded-full hover:border-orange-500/50 hover:text-orange-400 transition-all duration-200 cursor-pointer"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <StatCard
            icon={FaHeart}
            label="Favorite Movies"
            value={favMovies.length}
            gradient="linear-gradient(135deg, rgba(246,120,0,1), rgba(255,193,40,1))"
          />
          <StatCard
            icon={FaBookmark}
            label="Watchlist"
            value={wlMovies.length}
            gradient="linear-gradient(135deg, #6366f1, #818cf8)"
          />
          <StatCard
            icon={RiMovie2AiLine}
            label="Total Saved"
            value={favMovies.length + wlMovies.length}
            gradient="linear-gradient(135deg, #0ea5e9, #38bdf8)"
          />
        </div>

        {/* ── Tabs ── */}
        <div className="flex items-center gap-2 mt-8">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            const count = tab.id === 'favorites' ? favMovies.length : wlMovies.length
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isActive ? tab.activeClass : tab.inactiveClass
                }`}
              >
                <Icon className="text-xs" />
                {tab.label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white/20' : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-slate-800 mt-4 mb-8" />

        {/* ── Content ── */}
        {activeMovies.length === 0 ? (
          <EmptyState tab={activeTab} />
        ) : (
          <>
            <div className="flex justify-end mb-5">
              <button
                onClick={clearCurrent}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-red-400 border border-red-500/20 bg-red-500/5 rounded-full hover:bg-red-500/15 transition-all duration-200 cursor-pointer"
              >
                <FaTrash className="text-xs" />
                Clear all
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {activeMovies.map((movie) => (
                <MovieCard key={movie.imdbID} movie={movie} />
              ))}
            </div>
          </>
        )}

        <div className="pb-16" />
      </div>

      {/* ── Edit Profile Modal ── */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs px-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <FaTimes className="text-sm" />
            </button>

            <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <RiMovie2AiLine className="text-orange-500 text-lg" />
              Edit Profile Info
            </h3>

            {modalError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl mb-4">
                {modalError}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-1.5 ml-1">DISPLAY NAME</label>
                <input
                  type="text"
                  value={editDisplayName}
                  onChange={(e) => setEditDisplayName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-orange-500 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-2.5 ml-1">AVATAR GRADIENT</label>
                <div className="flex gap-2 justify-between">
                  {AVATAR_GRADIENTS.map((grad, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setEditGradient(grad)}
                      className="w-8 h-8 rounded-full relative hover:scale-110 transition-all cursor-pointer"
                      style={{ background: grad }}
                    >
                      {editGradient === grad && (
                        <span className="absolute inset-0 flex items-center justify-center text-white bg-black/20 rounded-full">
                          <FaCheck className="text-[10px]" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-orange-950/20 transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default Profile
