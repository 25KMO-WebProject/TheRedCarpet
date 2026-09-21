import './FavoritesPage.css'

export default function FavoritesPage({
  isAuthenticated = false,
  favorites = [],
  onMediaSelect
}) {
  if (!isAuthenticated) {
    return (
      <main className="favorites-page">
        <h1>Omat suosikit</h1>

        <div className="favorites-empty">
          <div className="favorites-heart">♡</div>

          <h2>Kirjaudu nähdäksesi suosikkisi</h2>

          <p>
            Suosikit tallennetaan käyttäjätilillesi.
            Kirjautumisen jälkeen voit lisätä elokuvia ja
            sarjoja suosikkeihin.
          </p>

          <button type="button">
            Kirjaudu
          </button>
        </div>
      </main>
    )
  }

  if (favorites.length === 0) {
    return (
      <main className="favorites-page">
        <h1>Omat suosikit</h1>

        <div className="favorites-empty">
          <div className="favorites-heart">♡</div>

          <h2>Ei vielä suosikkeja</h2>

          <p>
            Lisää elokuvia ja sarjoja suosikkeihin
            painamalla sydäntä.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="favorites-page">
      <h1>Omat suosikit</h1>

      <div className="favorites-grid">
        {favorites.map((item) => (
          <button
            type="button"
            className="favorite-card"
            key={`${item.media_type}-${item.id}`}
            onClick={() => onMediaSelect?.(item)}
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
        ))}
      </div>
    </main>
  )
}