import { useState, useEffect } from "react";
import "./App.css";

import NowPlaying from "./components/NowPlaying";
import Navbar from "./components/Navbar.jsx";
import SearchResults from "./components/search/SearchResults";
import MediaDetailsModal from "./components/search/MediaDetailsModal";
import FavoritesPage from "./components/favorites/FavoritesPage.jsx";
import SignUpModal from "./components/SignUpModal.jsx";
import SignInModal from "./components/SignInModal.jsx";
import SharedFavoritesPage from "./components/favorites/SharedFavoritesPage.jsx";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  createFavoritesShare,
  getSharedFavorites,
} from "./services/favoritesApi.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Groups from "./components/group/Groups.jsx";

function App() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [year, setYear] = useState("");
  const [movies, setMovies] = useState([]);

  const [hasSearched, setHasSearched] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const [selectedMedia, setSelectedMedia] = useState(null);
  const [currentView, setCurrentView] = useState("home");

  const [SignUpOpen, setSignUpOpen] = useState(false);
  const [SignInOpen, setSignInOpen] = useState(false);
  const [account, setAccount] = useState(() => {
    const savedAccount = localStorage.getItem("account");
    return savedAccount ? JSON.parse(savedAccount) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("account");

    setAccount(null);
    setToken(null);
    setFavorites([]);
  };

  // Favorites use the token for authenticated API requests.
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const [sharedFavorites, setSharedFavorites] = useState([]);

  const [favorites, setFavorites] = useState([]);
  const [favoritesRefresh, setFavoritesRefresh] = useState(0);

  useEffect(() => {
    function handleSessionExpired() {
      handleLogout();
      setSignInOpen(true);
    }

    window.addEventListener("sessionExpired", handleSessionExpired);

    return () => {
      window.removeEventListener("sessionExpired", handleSessionExpired);
    };
  }, []);

  const isAuthenticated = Boolean(token);

  const clearSearchResults = () => {
    setMovies([]);
    setHasSearched(false);
  };

  const searchMovies = async (event) => {
    event.preventDefault();

    if (!query.trim()) {
      return;
    }

    setSearchLoading(true);
    setHasSearched(true);

    try {
      const params = new URLSearchParams({
        query,
        type,
      });

      if (year) {
        params.set("year", year);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/tmdb/search?${params}`,
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const searchData = await response.json();

      setMovies(searchData.results || []);
    } catch (err) {
      console.error("Search failed:", err);
      setMovies([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Favorites API stores only TMDB ids and media types.
  // This function loads the full movie/TV details from TMDB.
  const loadFavoriteDetails = async (favoriteRows) => {
    const details = await Promise.all(
      favoriteRows.map(async (favorite) => {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/tmdb/details/${favorite.media_type}/${favorite.tmdb_id}`,
        );

        if (!response.ok) {
          return null;
        }

        return response.json();
      }),
    );
    return details.filter(Boolean);
  };

  // Load the user's favorite IDs from our API and fetch
  // the corresponding movie/TV details
  // Load the authenticated user's favorites.
  // First get the saved TMDB ids from our backend,
  // then load the full movie/TV details.
  const loadFavorites = async () => {
    if (!token) {
      setFavorites([]);
      return;
    }

    try {
      const favoriteRows = await getFavorites(token);

      const favoriteDetails = await loadFavoriteDetails(favoriteRows);

      setFavorites(favoriteDetails);
    } catch (error) {
      console.error(error);
      setFavorites([]);
    }
  };

  useEffect(() => {
    if (currentView === "favorites") {
      loadFavorites();
    }
  }, [currentView, token, favoritesRefresh]);

  // Check whether the selected TMDB item already exists in favorites.
  const isFavorite = (item) => {
    if (!item) {
      return false;
    }

    return favorites.some(
      (favorite) =>
        favorite.id === item.id && favorite.media_type === item.media_type,
    );
  };

  // Add or remove the selected movie/TV show from favorites.
  const toggleFavorite = async (item) => {
    if (!token || !item) {
      return;
    }

    const alreadyFavorite = isFavorite(item);

    try {
      if (alreadyFavorite) {
        await removeFavorite(token, item);

        setFavorites((current) =>
          current.filter(
            (favorite) =>
              !(
                favorite.id === item.id &&
                favorite.media_type === item.media_type
              ),
          ),
        );
      } else {
        await addFavorite(token, item);

        setFavorites((current) => [...current, item]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Create a public share link and copy it to the clipboard.
  // Returns true when the link was copied, otherwise false,
  // so the share button knows whether to show a success message.
  const shareFavorites = async () => {
    if (!token) {
      return false;
    }

    try {
      const data = await createFavoritesShare(token);

      const shareUrl = `${window.location.origin}/?sharedFavorites=${data.shareToken}`;

      await navigator.clipboard.writeText(shareUrl);

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const sharedFavoritesToken = new URLSearchParams(window.location.search).get(
    "sharedFavorites",
  );

  // Load a public favorites list using its share token.
  const loadSharedFavorites = async () => {
    if (!sharedFavoritesToken) {
      return;
    }

    try {
      const favoriteRows = await getSharedFavorites(sharedFavoritesToken);

      const favoriteDetails = await loadFavoriteDetails(favoriteRows);

      setSharedFavorites(favoriteDetails);
    } catch (error) {
      console.error(error);
      setSharedFavorites([]);
    }
  };

  useEffect(() => {
    if (sharedFavoritesToken) {
      loadSharedFavorites();
    }
  }, []);
  console.log("App: ", account);

  return (
    <>
      <BrowserRouter>
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
            setCurrentView("favorites");
            setFavoritesRefresh((prev) => prev + 1);
          }}

          onHomeClick={() => {
            setCurrentView("home");
          }}

          account={account}
          onSignUpClick={() => setSignUpOpen(true)}
          onSignInClick={() => setSignInOpen(true)}
          onLogout={handleLogout}
        />

        <Routes>
          <Route
            path="/"
            element={
              sharedFavoritesToken ? (
                <SharedFavoritesPage
                  favorites={sharedFavorites}
                  onMediaSelect={setSelectedMedia}
                />
              ) : currentView === "favorites" ? (
                <FavoritesPage
                  isAuthenticated={isAuthenticated}
                  favorites={favorites}
                  onMediaSelect={setSelectedMedia}
                  onShare={shareFavorites}
                />
              ) : (
                <main className="main-content">
                  <section className="search-results">
                    {searchLoading && <p>Haetaan...</p>}

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

                    {!searchLoading && hasSearched && movies.length === 0 && (
                      <p>Hakutuloksia ei löytynyt.</p>
                    )}
                  </section>

                  <NowPlaying onMediaSelect={setSelectedMedia} />
                </main>
              )
            }
          />

          <Route
            path="/groups"
            element={<Groups isAuthenticated={isAuthenticated} />}
          />
        </Routes>
      </BrowserRouter>

      <SignUpModal
        isOpen={SignUpOpen}
        onClose={() => setSignUpOpen(false)}
        onSuccess={() => {
          setSignUpOpen(false);
          setSignInOpen(true);
        }}
      />

      <SignInModal
        isOpen={SignInOpen}
        onClose={() => setSignInOpen(false)}
        onLogin={(data) => {
          const loggedInAccount = {
            id: data.id,
            token: data.token,
          };

          localStorage.setItem("token", data.token);
          localStorage.setItem("account", JSON.stringify(loggedInAccount));

          setToken(data.token);
          setAccount(loggedInAccount);
          setFavorites([]);
        }}
      />

      <MediaDetailsModal
        item={selectedMedia}
        onClose={() => setSelectedMedia(null)}
        isAuthenticated={isAuthenticated}
        token={token}
        isFavorite={selectedMedia ? isFavorite(selectedMedia) : false}
        onToggleFavorite={() => toggleFavorite(selectedMedia)}
      />
    </>
  );
}

export default App;
