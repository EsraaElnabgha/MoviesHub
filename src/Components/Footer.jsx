import { Link } from 'react-router-dom'
import { FaHeart, FaGithub, FaTwitter, FaInstagram, FaFilm } from 'react-icons/fa'
import { RiMovie2AiLine } from 'react-icons/ri'

const LINKS = {
  Browse: [
    { label: 'Home', to: '/' },
    { label: 'Movies', to: '/?type=movie' },
    { label: 'TV Series', to: '/?type=series' },
    { label: 'My Favorites', to: '/favorites' },
  ],
  Discover: [
    { label: 'Marvel Universe', to: '/?q=marvel' },
    { label: 'DC Comics', to: '/?q=batman' },
    { label: 'Star Wars', to: '/?q=star+wars' },
    { label: 'James Bond', to: '/?q=james+bond' },
  ],
}

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="w-full bg-slate-950 border-t border-white/5 mt-auto">
      {/* Top glow line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group w-fit">
              <img src="/logo.svg" alt="Movies Hub" className="h-10 w-auto" />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Your ultimate guide to cinema. Discover movies, track your watchlist, and find your next favorite movie — all in one place.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3 mt-6">
              {[
                { icon: FaGithub, href: '#', label: 'GitHub' },
                { icon: FaTwitter, href: '#', label: 'Twitter' },
                { icon: FaInstagram, href: '#', label: 'Instagram' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="p-2 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-orange-400 hover:border-orange-500/50 hover:bg-orange-500/10 transition-all duration-200"
                >
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation columns */}
          {Object.entries(LINKS).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {items.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-slate-400 hover:text-orange-400 transition-colors duration-200 flex items-center gap-1.5 group"
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-orange-500 transition-all duration-200 overflow-hidden" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-600 text-xs text-center sm:text-left">
            © {year} Movies Hub. Powered by{' '}
            <a
              href="https://www.omdbapi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500/70 hover:text-orange-400 transition-colors duration-200"
            >
              OMDB API
            </a>
            .
          </p>
          <p className="text-slate-600 text-xs flex items-center gap-1">
            Made with <FaHeart className="text-orange-500 text-xs" /> for movie lovers
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
