import { useState } from 'react'
import './App.css'

import SearchForm from './components/SearchForm'
import SearchResults from './components/SearchResults'

function App() {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('all')
  const [year, setYear] = useState('')
  const [movies, setMovies] = useState([])

  const searchMovies = async (event) => {
  event.preventDefault()

  if (!query.trim()) {
    return
  }

  try {
      const params = new URLSearchParams({
        query,
        type
      })

      if (year) {
        params.set('year', year)
      }

      const response = await fetch(
        `http://localhost:3000/api/tmdb/search?${params}`
      )

      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()

      setMovies(data.results || [])
    } catch (error) {
      console.error('Search failed:', error)
    }
  }

  return (
    <div>
      <h1>Movie Search</h1>

      <SearchForm
        query={query}
        setQuery={setQuery}
        type={type}
        setType={setType}
        year={year}
        setYear={setYear}
        onSearch={searchMovies}
        clearResults={() => setMovies([])}
      />

      <SearchResults results={movies} />
    </div>
  )
}

export default App