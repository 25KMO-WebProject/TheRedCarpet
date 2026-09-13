import { useEffect, useRef, useState } from 'react'
import SearchFilters from './SearchFilters'

export default function SearchBar({
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
  const filterWrapperRef = useRef(null)

  const filtersActive =
    type !== 'all' || year !== ''

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterWrapperRef.current &&
        !filterWrapperRef.current.contains(event.target)
      ) {
        setShowFilters(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowFilters(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return (
    <div className="search-container">
      <form className="search" onSubmit={onSearch}>
        <input
          type="text"
          placeholder="Hakukenttä"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            clearResults()
          }}
        />

        <div
          className="filter-wrapper"
          ref={filterWrapperRef}
        >
          <button
            type="button"
            className="filter-button"
            onClick={() => setShowFilters((value) => !value)}
          >
            ⚙
            {filtersActive && (
              <span className="filter-indicator" />
            )}
          </button>

          {showFilters && (
            <SearchFilters
              type={type}
              setType={setType}
              year={year}
              setYear={setYear}
              clearResults={clearResults}
            />
          )}
        </div>

        <button type="submit">
          Hae
        </button>
      </form>
    </div>
  )
}