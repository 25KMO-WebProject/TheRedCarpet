function SearchResult({ item, onSelect, onAddMovie, isMovieInGroup }) {
  const alreadyAdded = isMovieInGroup(item);

  const url = import.meta.env.VITE_API_URL;

  const name = item.title || item.name;

  const year = (item.release_date || item.first_air_date || "").substring(0, 4);

  const type = item.media_type === "tv" ? "Sarja" : "Elokuva";

  const posterUrl = item.poster_path
    ? `https://image.tmdb.org/t/p/w94_and_h141_face${item.poster_path}`
    : null;

  const rating = item.vote_average ? (item.vote_average / 2).toFixed(1) : null;

  function handleAddMovie(event) {
    // To not open movie details when pressing the "+" -button
    event.stopPropagation();
    onAddMovie(item);
  }

  const openDetails = () => {
    onSelect(item);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openDetails();
    }
  };

  return (
    <article
      className="search-result-row"
      onClick={openDetails}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex="0"
    >
      {posterUrl ? (
        <div className="poster">
          <img
            className="search-result-poster"
            src={posterUrl}
            alt={`${name} poster`}
          />
        </div>
      ) : (
        <div className="search-result-no-poster-list">Ei kuvaa</div>
      )}
      <div className="search-result-info-list">
        <h3>{name}</h3>

        <p className="search-result-meta">
          {year || "Vuosi ei tiedossa"} • {type}
        </p>

        {rating && <p className="search-result-rating">⭐ {rating} / 5 </p>}
      </div>
      <button
        type="button"
        className={alreadyAdded ? "movie-added" : ""}
        onClick={handleAddMovie}
        onKeyDown={(event) => event.stopPropagation()}
        disabled={alreadyAdded}
      >
        {alreadyAdded ? "✓" : "+"}
      </button>
    </article>
  );
}

export { SearchResult };
