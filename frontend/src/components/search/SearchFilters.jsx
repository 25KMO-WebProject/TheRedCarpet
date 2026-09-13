export default function SearchFilters({
  type,
  setType,
  year,
  setYear,
  clearResults
}) {
  const filtersActive =
    type !== 'all' || year !== ''

  const clearFilters = () => {
    setType('all')
    setYear('')
    clearResults()
  }

  return (
    <div className="search-filters">
      <label>
        <span>Tyyppi</span>

        <select
          value={type}
          onChange={(event) => {
            setType(event.target.value)
            clearResults()
          }}
        >
          <option value="all">
            Elokuvat ja sarjat
          </option>

          <option value="movie">
            Vain elokuvat
          </option>

          <option value="tv">
            Vain sarjat
          </option>
        </select>
      </label>

      <label>
        <span>Vuosi</span>

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

      {filtersActive && (
        <button
          type="button"
          className="clear-filters"
          onClick={clearFilters}
        >
          Tyhjennä
        </button>
      )}
    </div>
  )
}