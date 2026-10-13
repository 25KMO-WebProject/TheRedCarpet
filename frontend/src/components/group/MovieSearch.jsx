import { useState, useEffect, useRef } from "react";
import { searchTmdb } from "../../services/movieSearchApi";
import SearchBar from "../search/SearchBar";
import SearchResults from "../search/SearchResultsList.jsx";

export default function MovieSearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [year, setYear] = useState("");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const searchRef = useRef(null);

  // Clear previous search results
  function clearResults() {
    setResults([]);
    setHasSearched(false);
  }

  // Active search from input
  useEffect(() => {
    let cancelled = false;

    // Don't search if the input is empty
    if (query.trim() === "") {
      clearResults();
      setLoading(false);
      return;
    }

    setLoading(true);
    setHasSearched(false);

    // Wait 300ms after typing before searching
    const timeout = setTimeout(async () => {
      try {
        const movies = await searchTmdb(query, type, year);

        // Only update results if this search is still current
        if (cancelled === false) {
          setResults(movies);
        }
      } catch (error) {
        if (cancelled === false) {
          console.error("Search failed:", error);
          setResults([]);
        }
      } finally {
        if (cancelled === false) {
          setLoading(false);
          setHasSearched(true);
        }
      }
    }, 300);

    // Cancel the timer and ignore old results
    // when the search input changes
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [query, type, year]);

  // Close dropdown menu if clicking outside
  useEffect(() => {
    // No need to listen for clicks when dropdown is closed
    if (isDropdownOpen === false) {
      return;
    }

    function handleClickOutside(event) {
      // Don't close dropdown when interacting with movie details
      const clickedMovieDetails = event.target.closest(".media-modal-backdrop");

      if (clickedMovieDetails) {
        return;
      }

      // Check if the click happened inside the search area
      const clickedInsideSearch = searchRef.current.contains(event.target);

      if (clickedInsideSearch === false) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleClickOutside);

    // Remove the event listener when no longer needed
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Dropdown visibility
  function openDropdown() {
    setDropdownOpen(true);
  }

  // Only show results when:
  // 1. Dropdown is open
  // 2. Search input isn't empty
  // 3. Search is loading or has completed
  const showDropdown =
    isDropdownOpen && query.trim() !== "" && (loading || hasSearched);

  return (
    <div className="movie-search" ref={searchRef}>
      <SearchBar
        query={query}
        setQuery={setQuery}
        type={type}
        setType={setType}
        year={year}
        setYear={setYear}
        onSearch={(event) => event.preventDefault()}
        clearResults={clearResults}
        showSubmit={false}
        onFocus={openDropdown}
      />

      {showDropdown && (
        <div className="movie-search-dropdown">
          {loading && <p>Haetaan...</p>}

          {!loading && results.length > 0 && (
            <SearchResults results={results} onSelect={onSelect} />
          )}

          {!loading && results.length === 0 && <p>Hakutuloksia ei löytynyt</p>}
        </div>
      )}
    </div>
  );
}
