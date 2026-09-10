import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

import NowPlaying from "./components/NowPlaying";
import Navbar from './components/Navbar.jsx'
import SearchForm from './components/SearchForm'
import SearchResults from './components/SearchResults'

function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [query, setQuery] = useState('')
  const [type, setType] = useState('all')
  const [year, setYear] = useState('')
  const [movies, setMovies] = useState([])

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/`
      )

      setData(response.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // search Movies
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
        `${import.meta.env.VITE_API_URL}/tmdb/search?${params}`
      )

      if (!response.ok) {
        throw new Error('Search failed')
      }

      const searchData = await response.json()

      setMovies(searchData.results || [])
    } catch (err) {
      console.error('Search failed:', err)
    }
  }

  return (
    <>
      <Navbar
        query={query}
        setQuery={setQuery}
        type={type}
        setType={setType}
        year={year}
        setYear={setYear}
        onSearch={searchMovies}
        clearResults={() => setMovies([])}
      />

      <main className="main-content">
              <NowPlaying />
        <section className="search-results">
          {movies.length > 0 && (
            <>
              <h2>Hakutulokset</h2>
              <SearchResults results={movies} />
            </>
          )}
        </section>
      </main>
    </>
  )
}

export default App
