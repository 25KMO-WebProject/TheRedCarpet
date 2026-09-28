import './FavoritesPage.css'
import FavoriteCard from './FavoriteCard.jsx'
import ShareFavoritesButton from './ShareFavoritesButton.jsx'

export default function FavoritesPage({
  isAuthenticated = false,
  favorites = [],
  onMediaSelect,
  onShare
}) {
  // Favorites belong to a user account, so login is required.
  if (!isAuthenticated) {
    return (
      <main className="favorites-page">
        <h1>Omat suosikit</h1>

        <div className="favorites-empty">
          <div className="favorites-heart">
            ♡
          </div>

          <h2>
            Kirjaudu nähdäksesi suosikkisi
          </h2>

          <p>
            Suosikit tallennetaan käyttäjätilillesi.
            Kirjautumisen jälkeen voit lisätä elokuvia
            ja sarjoja suosikkeihin.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="favorites-page">
      <div className="favorites-header">
        <h1>Omat suosikit</h1>

        <ShareFavoritesButton onShare={onShare} />
      </div>

      {favorites.length === 0 ? (
        <div className="favorites-empty">
          <div className="favorites-heart">
            ♡
          </div>

          <h2>Ei vielä suosikkeja</h2>

          <p>
            Lisää elokuvia ja sarjoja suosikkeihin
            painamalla sydäntä.
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