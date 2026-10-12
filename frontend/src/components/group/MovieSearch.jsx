import { useState } from "react";
import { searchTmdb } from "../../services/movieSearchApi";
import SearchBar from "../search/SearchBar";
import SearchResults from "../search/SearchResults";

export default function MovieSearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [year, setYear] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  function clearResults() {
    setResults([]);
    setHasSearched(false);
  }

  async function handleSearch(event) {
    event.preventDefault();

    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);

    try {
      const movies = await searchTmdb(query, type, year);
      setResults(movies);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="movie-search">
      <SearchBar
        query={query}
        setQuery={setQuery}
        type={type}
        setType={setType}
        year={year}
        setYear={setYear}
        onSearch={handleSearch}
        clearResults={clearResults}
      />

      {loading && <p>Haetaan...</p>}

      {!loading && <SearchResults results={results} onSelect={onSelect} />}

      {!loading && hasSearched && results.length === 0 && (
        <p>Hakutuloksia ei löytynyt.</p>
      )}
    </div>
  );
}
