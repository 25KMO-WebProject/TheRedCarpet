import SearchResult from './SearchResult'

function SearchResults({
  results,
  onSelect
}) {
  return (
    <div className="search-results-grid">
      {results.map(item => (
        <SearchResult
          key={`${item.media_type}-${item.id}`}
          item={item}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

export default SearchResults