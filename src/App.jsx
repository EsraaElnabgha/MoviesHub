import './App.css'
import Navbar from './Components/Navbar'
import heroBg from './assets/background hero.jpg'
import { RiMovie2AiLine } from "react-icons/ri";


function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      
      {/* Hero & Navbar Container sharing the background */}
      <div className="relative w-full h-[560px] flex flex-col overflow-hidden pt-16">
        {/* Background Image with blur effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center filter blur-xs scale-110"
          style={{ backgroundImage: `url("${heroBg}")` }}
        />
        {/* Shared Dark overlay - reduced blackness (bg-black/35) */}
        <div className="absolute inset-0 bg-black/35 backdrop-blur-[1px]" />

        <Navbar />

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pb-12">
          <h1 className="text-4xl sm:text-6xl font-black text-grey-700 tracking-tight mb-4 drop-shadow-lg">
            <span 
              className="text-transparent bg-clip-text bg-cover"
              style={{ backgroundImage: 'linear-gradient(335deg, rgba(246, 120, 0, 1) 22%, rgba(255, 193, 40, 1) 53%)' }}
            >
              Movies
            </span>
            <span className="text-gray-200 ml-3">Hub </span>
            <RiMovie2AiLine className="text-yellow-500 text-5xl inline-block" />

          </h1>
          <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-xl mx-auto drop-shadow-md">
            Discover, track, and share your favorite movies. Your ultimate guide to the world of cinema.
          </p>
          
          {/* Search bar inside Hero */}
          <div className="max-w-md w-full mx-auto flex items-center bg-slate-950/70 backdrop-blur-md border border-white/10 rounded-full p-1.5 focus-within:ring-2 focus-within:ring-indigo-500 transition-all duration-300">
            <input 
              type="text" 
              placeholder="Search for movies, actors..." 
              className="flex-1 bg-transparent border-0 px-4 py-2 text-white placeholder-gray-400 focus:outline-none text-sm"
            />
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-6 py-2 rounded-full transition-all duration-200 shadow-md cursor-pointer">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-extrabold text-indigo-400 mb-8 tracking-tight drop-shadow-md border-b border-slate-800 pb-2">
          Favorite Movies
        </h2>
        {/* Placeholder for movie grid/list */}
        <div className="text-slate-500 text-center py-12 border-2 border-dashed border-slate-800 rounded-2xl">
          No favorite movies added yet. Start searching to add some!
        </div>
      </div>
    </div>
  )
}

export default App
