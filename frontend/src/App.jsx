import { useState } from 'react'
import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState([])

  const searchMovies = async (event) => {
    event.preventDefault()

    if (!query.trim()) {
      return
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/tmdb/search?query=${encodeURIComponent(query)}`
      )

      const data = await response.json()

      setMovies(data.results || [])
    } catch (error) {
      console.error('Search failed:', error)
    }
  }

  return (
    <>
      <div>
        <h1>Movie Search</h1>

        <form onSubmit={searchMovies}>
          <input
            type="text"
            placeholder="Search movie..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <button type="submit">
            Search
          </button>
        </form>

        <div>
          {movies.map((movie) => (
            <div key={movie.id}>
              <h3>{movie.title}</h3>

              {<p>
                Release date: {movie.release_date || 'Unknown'}
              </p>}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default App
