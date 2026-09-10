function SearchForm({
  query,
  setQuery,
  type,
  setType,
  year,
  setYear,
  onSearch,
  clearResults
}) {
  return (
    <form onSubmit={onSearch}>
      <input
        type="text"
        placeholder="Search movie or TV show..."
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          clearResults()
        }}
      />

      <select
        value={type}
        onChange={(event) => {
          setType(event.target.value)
          clearResults()
        }}
      >
        <option value="all">Movies and TV shows</option>
        <option value="movie">Movies only</option>
        <option value="tv">TV shows only</option>
      </select>

      <input
        type="number"
        placeholder="Year"
        value={year}
        onChange={(event) => {
          setYear(event.target.value)
          clearResults()
        }}
      />

      <button type="submit">Search</button>
    </form>
  )
}

export default SearchForm