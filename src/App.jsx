import { useState } from 'react'
import { BrowserRouter, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './context/AuthContext'
import Navbar from './Components/Navbar'
import AppRoutes from './Routes/AppRoutes'
import AutoCarousel from './Components/AutoCarousel'
import Footer from './Components/Footer'
import heroBg from './assets/background hero.jpg'
import { RiMovie2AiLine } from 'react-icons/ri'

// Hero is shown only on the clean home page (no search/type filters active)
function Hero() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  // Hide hero when on a different page OR when a search/type filter is active
  const isHome = location.pathname === '/'
  const hasFilter = searchParams.get('q') || searchParams.get('type')
  if (!isHome || hasFilter) return null

  function handleSearch(e) {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <div className="relative w-full h-[420px] sm:h-[500px] flex flex-col overflow-hidden pt-16">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-xs scale-110"
        style={{ backgroundImage: `url("${heroBg}")` }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/35 backdrop-blur-[1px]" />

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pb-8">
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-4 drop-shadow-lg">
          <span
            className="text-transparent bg-clip-text bg-cover"
            style={{ backgroundImage: 'linear-gradient(335deg, rgba(246, 120, 0, 1) 22%, rgba(255, 193, 40, 1) 53%)' }}
          >
            Movies
          </span>
          <span
            className="text-transparent bg-clip-text bg-cover ml-3"
            style={{ backgroundImage: 'linear-gradient(335deg, rgba(193, 192, 186, 1) 22%, rgba(253, 252, 249, 1) 53%)' }}
          >
            Hub
          </span>
          <RiMovie2AiLine className="text-yellow-500 text-5xl inline-block mb-1" />
        </h1>
        <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-xl mx-auto drop-shadow-md">
          Discover, track, and share your favorite movies. Your ultimate guide to the world of cinema.
        </p>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="max-w-md w-full mx-auto flex items-center bg-slate-950/70 backdrop-blur-md border border-white/10 rounded-full p-1.5 focus-within:ring-2 focus-within:ring-orange-500 transition-all duration-300"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for movies, tv shows..."
            className="flex-1 bg-transparent border-0 px-4 py-2 text-white placeholder-gray-400 focus:outline-none text-sm"
          />
          <button
            type="submit"
            className="bg-orange-400 hover:bg-orange-500 text-white font-semibold text-sm px-6 py-2 rounded-full transition-all duration-200 shadow-md cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  )
}

function CarouselSection() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const isHome = location.pathname === '/'
  const hasFilter = searchParams.get('q') || searchParams.get('type')
  if (!isHome || hasFilter) return null
  return <AutoCarousel />
}

function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />
      <Hero />
      <CarouselSection />
      <main className="flex-1">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
