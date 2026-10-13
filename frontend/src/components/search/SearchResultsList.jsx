import { SearchResult } from "./SearchResultList.jsx";

export default function SearchResults({ results, onSelect, onAddMovie }) {
  return (
    <div className="search-results-list">
      {results.map((item) => (
        <SearchResult
          key={`${item.media_type}-${item.id}`}
          item={item}
          onSelect={onSelect}
          onAddMovie={onAddMovie}
        />
      ))}
    </div>
  );
}
