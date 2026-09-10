import { useState } from 'react'
import "./Navbar.css"

export default function Navbar({
  query,
  setQuery,
  type,
  setType,
  year,
  setYear,
  onSearch,
  clearResults
}) {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <nav>
      <div className="nav-left">
        <h1>
          The<br />RedCarpet
        </h1>

        <div className="search-container">
          <form className="search" onSubmit={onSearch}>
            <input
              type="text"
              placeholder="Hakukenttä"
              aria-label="Hae"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                clearResults()
              }}
            />

            <button
              type="button"
              className="filter-button"
              onClick={() => setShowFilters(!showFilters)}
            >
              Suodattimet ▼
            </button>

            <button type="submit">
              Hae
            </button>
          </form>

          {showFilters && (
            <div className="search-filters">
              <label>
                Tyyppi:
                <select
                  value={type}
                  onChange={(event) => {
                    setType(event.target.value)
                    clearResults()
                  }}
                >
                  <option value="all">Elokuvat ja sarjat</option>
                  <option value="movie">Vain elokuvat</option>
                  <option value="tv">Vain sarjat</option>
                </select>
              </label>

              <label>
                Vuosi:
                <input
                  type="number"
                  placeholder="Esim. 2022"
                  value={year}
                  onChange={(event) => {
                    setYear(event.target.value)
                    clearResults()
                  }}
                />
              </label>
            </div>
          )}
        </div>
      </div>

      <ul>
        <li><a href="#">Ryhmäsivu</a></li>
        <li><a href="#">Arvostelut</a></li>
        <li><a href="#">Suosikit/SuosikkiLista</a></li>
        <li><button className="signup">Rekisteröidy</button></li>
        <li><button className="signin">Kirjaudu</button></li>
      </ul>
    </nav>
  )
}