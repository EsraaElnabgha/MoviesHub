// Shared localStorage helpers for Favorites and Watchlist

export const FAVORITES_KEY = 'moviesHubFavorites'
export const WATCHLIST_KEY = 'moviesHubWatchlist'

function getList(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || []
  } catch {
    return []
  }
}

function toggleItem(key, movie) {
  const list = getList(key)
  const exists = list.some((m) => m.imdbID === movie.imdbID)
  const updated = exists
    ? list.filter((m) => m.imdbID !== movie.imdbID)
    : [...list, movie]
  localStorage.setItem(key, JSON.stringify(updated))
  return !exists // returns new "in list" state
}

export const favorites = {
  getAll: () => getList(FAVORITES_KEY),
  has: (imdbID) => getList(FAVORITES_KEY).some((m) => m.imdbID === imdbID),
  toggle: (movie) => toggleItem(FAVORITES_KEY, movie),
}

export const watchlist = {
  getAll: () => getList(WATCHLIST_KEY),
  has: (imdbID) => getList(WATCHLIST_KEY).some((m) => m.imdbID === imdbID),
  toggle: (movie) => toggleItem(WATCHLIST_KEY, movie),
}
