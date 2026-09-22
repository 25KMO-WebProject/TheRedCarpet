import { useState, useEffect } from 'react'
import './App.css'

import NowPlaying from "./components/NowPlaying"
import Navbar from './components/Navbar.jsx'
import SearchResults from './components/search/SearchResults'
import MediaDetailsModal from './components/search/MediaDetailsModal'
import FavoritesPage from './components/favorites/FavoritesPage.jsx'
import SignUpModal from "./components/SignUpModal.jsx"
import SignInModal from "./components/SignInModal.jsx"

function App() {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('all')
  const [year, setYear] = useState('')
  const [movies, setMovies] = useState([])

  const [hasSearched, setHasSearched] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)

  const [selectedMedia, setSelectedMedia] = useState(null)
  const [currentView, setCurrentView] = useState('home')

  const [SignUpOpen, setSignUpOpen] = useState(false)
  const [SignInOpen, setSignInOpen] = useState(false)
  const [account, setAccount] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token")
    setAccount(null)
    setToken(null)
  }

  // Favorites use the token for authenticated API requests.
  const [token, setToken] = useState(
    () => localStorage.getItem('token')
  )

  const [favorites, setFavorites] = useState([])

  const isAuthenticated = Boolean(token)

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

  // Load the user's favorite IDs from our API and fetch
  // the corresponding movie/TV details
  const loadFavorites = async () => {
    if (!token) {
      setFavorites([])
      return
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/favorites`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (!response.ok) {
        throw new Error('Suosikkien hakeminen epäonnistui')
      }

      const favoriteRows = await response.json()

      const favoriteDetails = await Promise.all(
        favoriteRows.map(async (favorite) => {
          const detailsResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/tmdb/details/${favorite.media_type}/${favorite.tmdb_id}`
          )

          if (!detailsResponse.ok) {
            return null
          }

          return detailsResponse.json()
        })
      )

      setFavorites(
        favoriteDetails.filter(Boolean)
      )
    } catch (error) {
      console.error(error)
      setFavorites([])
    }
  }

  useEffect(() => {
    if (currentView === 'favorites') {
      loadFavorites()
    }
  }, [currentView, token])

  // Check whether the selected TMDB item already exists in favorites.
  const isFavorite = (item) => {
    if (!item) {
      return false
    }

    return favorites.some(
      favorite =>
        favorite.id === item.id &&
        favorite.media_type === item.media_type
    )
  }

  // Add or remove a favorite
  const toggleFavorite = async (item) => {
    if (!token || !item) {
      return
    }

    const alreadyFavorite = isFavorite(item)

    try {
      if (alreadyFavorite) {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/favorites/${item.media_type}/${item.id}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        if (!response.ok) {
          throw new Error('Suosikin poistaminen epäonnistui')
        }

        setFavorites(current =>
          current.filter(
            favorite =>
              !(
                favorite.id === item.id &&
                favorite.media_type === item.media_type
              )
          )
        )
      } else {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/favorites`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              tmdbId: item.id,
              mediaType: item.media_type
            })
          }
        )

        if (!response.ok) {
          throw new Error('Suosikin lisääminen epäonnistui')
        }

        setFavorites(current => [
          ...current,
          item
        ])
      }
    } catch (error) {
      console.error(error)
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

        onFavoritesClick={() => {
          setCurrentView('favorites')
        }}

        onHomeClick={() => {
          setCurrentView('home')
        }}

        account={account}
        onSignUpClick={() => setSignUpOpen(true)}
        onSignInClick={() => setSignInOpen(true)}
        onLogout={handleLogout}
      />

      {currentView === 'favorites' ? (
        <FavoritesPage
          isAuthenticated={isAuthenticated}
          favorites={favorites}
          onMediaSelect={setSelectedMedia}
        />
      ) : (
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

                <SearchResults
                  results={movies}
                  onSelect={setSelectedMedia}
                />
              </>
            )}

            {!searchLoading &&
              hasSearched &&
              movies.length === 0 && (
                <p>Hakutuloksia ei löytynyt.</p>
              )}
          </section>

          <NowPlaying />
        </main>
      )}

      <SignUpModal
        isOpen={SignUpOpen}
        onClose={() => setSignUpOpen(false)}
      />

      <SignInModal
        isOpen={SignInOpen}
        onClose={() => setSignInOpen(false)}
        onLogin={(newToken) => {
          localStorage.setItem('token', newToken)
          setToken(newToken)
          setAccount({ 
            id: response.data.id,
            token: newToken
          })
          setFavorites([])
        }}
      />

      <MediaDetailsModal
        item={selectedMedia}
        onClose={() => setSelectedMedia(null)}
        isAuthenticated={isAuthenticated}
        isFavorite={
          selectedMedia
            ? isFavorite(selectedMedia)
            : false
        }
        onToggleFavorite={() =>
          toggleFavorite(selectedMedia)
        }
      />
    </>
  )
}

export default App