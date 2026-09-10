function SearchResult({ item }) {
  const name = item.title || item.name

  const year =
    (item.release_date || item.first_air_date || 'Unknown')
      .substring(0, 4)

  const type =
    item.media_type === 'tv'
      ? 'TV show'
      : 'Movie'

  return (
    <div>
      <h3>{name}</h3>
      <p>Year: {year}</p>
      <p>Type: {type}</p>
    </div>
  )
}

export default SearchResult