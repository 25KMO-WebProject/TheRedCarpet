// Displays one movie or TV show in a favorites list.
// The parent component decides what happens when the card is clicked.
export default function FavoriteCard({
  item,
  onSelect
}) {
  return (
    <button
      type="button"
      className="favorite-card"
      onClick={() => onSelect?.(item)}
    >
      {item.poster_path && (
        <img
          src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
          alt={item.title || item.name}
        />
      )}

      <div>
        <strong>
          {item.title || item.name}
        </strong>
      </div>
    </button>
  )
}