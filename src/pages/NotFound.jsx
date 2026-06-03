import { useNavigate } from 'react-router-dom'

function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center text-center px-6">
      <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-400 mb-4">
        404
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
      <p className="text-slate-400 text-sm mb-8 max-w-xs">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => navigate('/')}
        className="px-8 py-3 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-full transition-all duration-200 shadow-lg shadow-orange-900/30 cursor-pointer"
      >
        Back to Home
      </button>
    </div>
  )
}

export default NotFound
