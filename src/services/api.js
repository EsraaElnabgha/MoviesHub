const API_KEY = 'ca9cb363'
const BASE_URL = 'https://www.omdbapi.com'

/**
 * Search for movies/series by keyword.
 * @param {string} query - The search keyword
 * @param {string} type - 'movie', 'series', or '' for all
 * @param {number} page - Page number (default 1, each page = 10 results)
 * @returns {Promise<{ movies: Array, totalResults: number }>}
 */
export async function searchMovies(query, type = '', page = 1) {
  const params = new URLSearchParams({
    apikey: API_KEY,
    s: query,
    page,
    ...(type && { type }),
  })
  const res = await fetch(`${BASE_URL}?${params}`)
  const data = await res.json()
  if (data.Response === 'False') {
    return { movies: [], totalResults: 0, error: data.Error }
  }
  return {
    movies: data.Search || [],
    totalResults: parseInt(data.totalResults, 10) || 0,
  }
}

/**
 * Get full details for a single movie by its IMDB ID.
 * @param {string} imdbID - e.g. 'tt4154796'
 * @returns {Promise<object>} Full movie object or { error: string }
 */
export async function getMovieDetails(imdbID) {
  const params = new URLSearchParams({
    apikey: API_KEY,
    i: imdbID,
    plot: 'full',
  })
  const res = await fetch(`${BASE_URL}?${params}`)
  const data = await res.json()
  if (data.Response === 'False') {
    return { error: data.Error }
  }
  return data
}
