function SearchResult({
  item,
  onSelect
}) {
  const name = item.title || item.name

  const year =
    (item.release_date ||
      item.first_air_date ||
      '')
      .substring(0, 4)

  const type =
    item.media_type === 'tv'
      ? 'Sarja'
      : 'Elokuva'

  const posterUrl = item.poster_path
    ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
    : null

  const rating = item.vote_average
    ? (item.vote_average / 2).toFixed(1)
    : null

  const openDetails = () => {
    onSelect(item)
  }

  const handleKeyDown = (event) => {
    if (
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      event.preventDefault()
      openDetails()
    }
  }

  return (
    <article
      className="search-result-card"
      onClick={openDetails}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex="0"
    >
      {posterUrl ? (
        <img
          className="search-result-poster"
          src={posterUrl}
          alt={`${name} poster`}
        />
      ) : (
        <div className="search-result-no-poster">
          Ei kuvaa
        </div>
      )}

      <div className="search-result-info">
        <h3>{name}</h3>

        <p className="search-result-meta">
          {year || 'Vuosi ei tiedossa'} • {type}
        </p>

        {rating && (
          <p className="search-result-rating">
            ⭐ {rating} / 5
          </p>
        )}
      </div>
    </article>
  )
}

export default SearchResult