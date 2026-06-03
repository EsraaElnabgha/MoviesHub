import React, { useState } from 'react'

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 w-full bg-slate-950/50 backdrop-blur-md after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/5 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          
          {/* Mobile menu button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button 
              type="button" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500"
            >
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">Open main menu</span>
              {/* Menu open/close icons */}
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

          <div className="flex flex-1 items-center justify-between sm:items-stretch">
            <div className="flex items-center justify-center sm:justify-start w-full sm:w-auto">
              <div className="flex shrink-0 items-center">
                <img 
                  src="/logo.svg" 
                  alt="Your Company" 
                  className="h-12 w-auto" 
                />
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4 py-2">
                  <a href="#" aria-current="page" className="rounded-md bg-gray-950/50 px-3 py-2 text-sm font-medium text-white">Home</a>
                  <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">Movies</a>
                  <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">TV Series</a>
                  <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">Favorites</a>
                </div>
              </div>
            </div>

            {/* Search Bar in Navbar */}
            <div className="hidden md:flex flex-1 max-w-xs mx-6 items-center">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input 
                  type="text" 
                  placeholder="Quick search..." 
                  className="block w-full pl-9 pr-3 py-1.5 bg-slate-950/40 border border-white/10 rounded-full text-sm text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-slate-950/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button 
              type="button" 
              className="relative rounded-full p-1 text-gray-400 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
            >
              <span className="absolute -inset-1.5"></span>
              <span className="sr-only">View notifications</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="h-6 w-6">
                <path d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Profile dropdown */}
            <div className="relative ml-3">
              <button 
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="relative flex rounded-full p-1 text-gray-400 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                <span className="absolute -inset-1.5"></span>
                <span className="sr-only">Open user menu</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              {profileOpen && (
                <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 outline -outline-offset-1 outline-white/10 shadow-lg ring-1 ring-black ring-opacity-5">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5">Your profile</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5">Settings</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5">Sign out</a>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-gray-900 px-2 pt-2 pb-3 space-y-1">
          <a href="#" aria-current="page" className="block rounded-md bg-gray-950/50 px-3 py-2 text-base font-medium text-white">Home</a>
          <a href="#" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white">Movies</a>
          <a href="#" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white">Favorites</a>
          <a href="#" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white">My List</a>
        </div>
      )}
    </nav>
  )
}

export default Navbar