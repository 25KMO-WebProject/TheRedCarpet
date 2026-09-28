import './FavoritesPage.css'
import FavoriteCard from './FavoriteCard.jsx'

export default function SharedFavoritesPage({
  favorites = [],
  onMediaSelect
}) {
  return (
    <main className="favorites-page">
      <div className="favorites-header">
        <h1>Jaettu suosikkilista</h1>
      </div>

      {favorites.length === 0 ? (
        <div className="favorites-empty">
          <div className="favorites-heart">
            ♡
          </div>

          <h2>Lista on tyhjä</h2>

          <p>
            Käyttäjällä ei ole tällä hetkellä
            jaettuja suosikkeja.
          </p>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((item) => (
            <FavoriteCard
              key={`${item.media_type}-${item.id}`}
              item={item}
              onSelect={onMediaSelect}
            />
          ))}
        </div>
      )}
    </main>
  )
}