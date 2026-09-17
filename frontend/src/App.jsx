import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

import NowPlaying from "./components/NowPlaying";
import Navbar from './components/Navbar.jsx'
import SearchResults from './components/search/SearchResults'
import SignUpModal from "./components/SignUpModal"

function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [query, setQuery] = useState('')
  const [type, setType] = useState('all')
  const [year, setYear] = useState('')
  const [movies, setMovies] = useState([])

  const [hasSearched, setHasSearched] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)

  //Rekistöröityminen
  const [SignUpOpen, setSignUpOpen] = useState(false)

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

  const clearSearchResults = () => {
    setMovies([])
    setHasSearched(false)
  }

  const searchMovies = async (event) => {
    event.preventDefault()

    if (!query.trim()) {
      return
    }

    setSearchLoading(true)
    setHasSearched(true)

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
      setMovies([])
    } finally {
      setSearchLoading(false)
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
        clearResults={clearSearchResults}

        /* Rekistöröitymis nappiin*/
        onSignupClick={() => setSignUpOpen(true)}
      />

      <main className="main-content">
        <section className="search-results">
          {searchLoading && (
            <p>Haetaan...</p>
          )}

          {!searchLoading && movies.length > 0 && (
            <>
              <h2>
                Hakutulokset haulle "{query}" ({movies.length})
              </h2>

              <SearchResults results={movies} />
            </>
          )}

          {!searchLoading && hasSearched && movies.length === 0 && (
            <p>Hakutuloksia ei löytynyt.</p>
          )}
        </section>
              <NowPlaying />
      </main>
      <SignUpModal
        isOpen={SignUpOpen}
        onClose={() => setSignUpOpen(false)}
        />
    </>
  )
}

export default App
