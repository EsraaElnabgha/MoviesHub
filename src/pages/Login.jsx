import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaUser, FaLock, FaEnvelope, FaCheck, FaExclamationCircle } from 'react-icons/fa'
import { RiMovie2AiLine } from 'react-icons/ri'
import { AVATAR_GRADIENTS } from '../services/auth'

function Login() {
  const { user, login, register } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectPath = searchParams.get('redirect') || '/profile'

  // Tab state: 'login' or 'register'
  const [activeTab, setActiveTab] = useState('login')

  // Form states
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [selectedGradient, setSelectedGradient] = useState(AVATAR_GRADIENTS[0])

  // Error/Success states
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(redirectPath, { replace: true })
    }
  }, [user, navigate, redirectPath])

  // Clear messages when switching tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setError('')
    setSuccess('')
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!username || !password) {
      setError('Please fill in all fields.')
      return
    }

    setLoading(true)
    // Delay for premium feel/animation
    setTimeout(() => {
      const res = login(username, password)
      setLoading(false)
      if (res.success) {
        setSuccess('Logged in successfully! Redirecting...')
        setTimeout(() => {
          navigate(redirectPath, { replace: true })
        }, 800)
      } else {
        setError(res.error)
      }
    }, 600)
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Basic client-side validation
    if (!username.trim() || !email.trim() || !password || !displayName.trim()) {
      setError('Please fill in all fields.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    // Email regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)
    setTimeout(() => {
      const res = register(username, email, password, displayName)
      setLoading(false)
      if (res.success) {
        setSuccess('Account created successfully! Welcome to MoviesHub...')
        setTimeout(() => {
          navigate(redirectPath, { replace: true })
        }, 1000)
      } else {
        setError(res.error)
      }
    }, 800)
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center py-20 px-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-orange-600/10 blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-700/10 blur-3xl translate-x-1/2 translate-y-1/2" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />

      {/* Main card */}
      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10">
        
        {/* Logo and Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-transparent bg-clip-text text-3xl font-black tracking-tight"
              style={{ backgroundImage: 'linear-gradient(335deg, #f67800 22%, #ffc128 53%)' }}
            >
              Movies
            </span>
            <span
              className="text-transparent bg-clip-text text-3xl font-black tracking-tight"
              style={{ backgroundImage: 'linear-gradient(335deg, #c1c0ba 22%, #fdfcf9 53%)' }}
            >
              Hub
            </span>
            <RiMovie2AiLine className="text-yellow-500 text-3xl" />
          </div>
          <p className="text-slate-400 text-xs font-medium">Your personal cinema hub</p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-950/80 p-1 rounded-full mb-6 border border-white/5">
          <button
            onClick={() => handleTabChange('login')}
            className={`flex-1 py-2 text-center text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer ${
              activeTab === 'login'
                ? 'bg-orange-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => handleTabChange('register')}
            className={`flex-1 py-2 text-center text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer ${
              activeTab === 'register'
                ? 'bg-orange-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form Messages */}
        {error && (
          <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3.5 rounded-2xl mb-5">
            <FaExclamationCircle className="flex-shrink-0 text-sm" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm p-3.5 rounded-2xl mb-5">
            <FaCheck className="flex-shrink-0 text-sm" />
            <p>{success}</p>
          </div>
        )}

        {/* Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-400 text-xs font-semibold mb-1.5 ml-1">USERNAME OR EMAIL</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                  <FaUser className="text-xs" />
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. movielover"
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-xs font-semibold mb-1.5 ml-1">PASSWORD</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                  <FaLock className="text-xs" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-200"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold text-sm rounded-2xl hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 shadow-lg shadow-orange-950/40 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 cursor-pointer mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        )}

        {/* Register Form */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-400 text-xs font-semibold mb-1.5 ml-1">DISPLAY NAME</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                  <FaUser className="text-xs" />
                </span>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-xs font-semibold mb-1.5 ml-1">USERNAME</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                  <FaUser className="text-xs" />
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. johndoe"
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-xs font-semibold mb-1.5 ml-1">EMAIL ADDRESS</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                  <FaEnvelope className="text-xs" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. john@example.com"
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-xs font-semibold mb-1.5 ml-1">PASSWORD (MIN. 6 CHARS)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                  <FaLock className="text-xs" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-xs font-semibold mb-1.5 ml-1">CONFIRM PASSWORD</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                  <FaLock className="text-xs" />
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Profile Avatar Theme Selector */}
            <div>
              <label className="block text-slate-400 text-xs font-semibold mb-2 ml-1">CHOOSE PROFILE GRADIENT</label>
              <div className="flex gap-2.5 justify-between">
                {AVATAR_GRADIENTS.map((grad, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedGradient(grad)}
                    className="w-9 h-9 rounded-full relative hover:scale-110 active:scale-95 transition-all duration-150 cursor-pointer flex-shrink-0"
                    style={{ background: grad }}
                  >
                    {selectedGradient === grad && (
                      <span className="absolute inset-0 flex items-center justify-center text-white text-xs bg-black/20 rounded-full">
                        <FaCheck className="text-[10px]" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold text-sm rounded-2xl hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 shadow-lg shadow-orange-950/40 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 cursor-pointer mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                'Register & Sign In'
              )}
            </button>
          </form>
        )}

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
            ← Back to browsing movies
          </Link>
        </div>

      </div>
    </div>
  )
}

export default Login
