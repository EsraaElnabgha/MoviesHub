function Loader({ size = 'md', text = 'Loading...' }) {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-4',
    lg: 'h-16 w-16 border-4',
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div
        className={`${sizeClasses[size]} rounded-full border-slate-700 border-t-orange-500 animate-spin`}
      />
      {text && <p className="text-slate-400 text-sm animate-pulse">{text}</p>}
    </div>
  )
}

export default Loader
