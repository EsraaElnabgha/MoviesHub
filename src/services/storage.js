// Shared localStorage helpers for Favorites and Watchlist

export const FAVORITES_KEY = 'moviesHubFavorites'
export const WATCHLIST_KEY = 'moviesHubWatchlist'

function getUserKey(baseKey) {
  try {
    const currentUser = JSON.parse(localStorage.getItem('moviesHubCurrentUser'))
    if (currentUser && currentUser.username) {
      return `${baseKey}_${currentUser.username}`
    }
  } catch {
    // fallback
  }
  return `${baseKey}_guest`
}

function getList(baseKey) {
  const key = getUserKey(baseKey)
  try {
    return JSON.parse(localStorage.getItem(key)) || []
  } catch {
    return []
  }
}

function toggleItem(baseKey, movie) {
  const key = getUserKey(baseKey)
  const list = getList(baseKey)
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

