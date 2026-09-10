import SearchResult from './SearchResult'

function SearchResults({ results }) {
  return (
    <div>
      {results.map((item) => (
        <SearchResult
          key={`${item.media_type}-${item.id}`}
          item={item}
        />
      ))}
    </div>
  )
}

export default SearchResults