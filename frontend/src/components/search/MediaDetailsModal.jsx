import { useEffect, useState } from 'react'
import './MediaDetailsModal.css'
import FavoriteButton from '../favorites/FavoriteButton.jsx'

export default function MediaDetailsModal({
  item,
  onClose
}) {
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // For future favorite feature
  const [favorite, setFavorite] = useState(false)

  useEffect(() => {
    if (!item) {
      return
    }

    const fetchDetails = async () => {
      setLoading(true)
      setError(null)
      setDetails(null)

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/tmdb/details/${item.media_type}/${item.id}`
        )

        if (!response.ok) {
          throw new Error('Tietojen hakeminen epäonnistui')
        }

        const data = await response.json()

        setDetails(data)
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDetails()
  }, [item])

  useEffect(() => {
    if (!item) {
      return
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener(
        'keydown',
        handleEscape
      )
    }
  }, [item, onClose])

  if (!item) {
    return null
  }

  const closeFromBackdrop = (event) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  const posterUrl = details?.poster_path
    ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
    : null

  const year =
    details?.release_date
      ?.substring(0, 4) || 'Ei tiedossa'

  const providers =
    details?.watch_providers?.flatrate || []

  return (
    <div
      className="media-modal-backdrop"
      onMouseDown={closeFromBackdrop}
    >
      <div
        className="media-modal"
        role="dialog"
        aria-modal="true"
      >

        {loading && (
          <p>Haetaan tietoja...</p>
        )}

        {error && (
          <p>{error}</p>
        )}

        {details && (
          <div className="media-modal-content">
            <div className="media-modal-poster">
              {posterUrl ? (
                <img
                  src={posterUrl}
                  alt={`${details.title} poster`}
                />
              ) : (
                <div className="media-modal-no-image">
                  Ei kuvaa
                </div>
              )}
            </div>

            <div className="media-modal-info">
              <div className="media-modal-header">
                <h2>{details.title}</h2>

                <div className="media-modal-actions">
                  <FavoriteButton
                    isAuthenticated={false}
                    isFavorite={false}
                    onToggle={() => {}}
                  />

                  <button
                    type="button"
                    className="media-modal-close"
                    onClick={onClose}
                    aria-label="Sulje"
                    title="Sulje"
                  >
                    ×
                  </button>
                </div>
              </div>

              <p>
                <strong>Vuosi:</strong>{' '}
                {year}
              </p>

              <p>
                <strong>Tyyppi:</strong>{' '}
                {details.media_type === 'tv'
                  ? 'Sarja'
                  : 'Elokuva'}
              </p>

              <p>
                <strong>Genret:</strong>{' '}
                {details.genres.length > 0
                  ? details.genres
                      .map(genre => genre.name)
                      .join(', ')
                  : 'Ei tiedossa'}
              </p>

              <p>
                <strong>Ikäraja:</strong>{' '}
                {details.certification ||
                  'Ei tiedossa'}
              </p>

              {details.runtime && (
                <p>
                  <strong>Kesto:</strong>{' '}
                  {details.runtime} min
                </p>
              )}

              {details.vote_average > 0 && (
                <p>
                  <strong>Arvosana:</strong>{' '}
                  ⭐ { (details.vote_average / 2).toFixed(1) }
                </p>
              )}

              <div className="media-modal-description">
                <h3>Kuvaus</h3>

                <p>
                  {details.overview ||
                    'Kuvausta ei ole saatavilla.'}
                </p>
              </div>

              <div className="media-modal-providers">
                <h3>Katsottavissa Suomessa</h3>

                {providers.length > 0 ? (
                  <div className="provider-list">
                    {providers.map(provider => (
                      <div
                        key={provider.provider_id}
                        className="provider"
                      >
                        {provider.logo_path && (
                          <img
                            src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                            alt={provider.provider_name}
                          />
                        )}

                        <span>
                          {provider.provider_name}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>
                    Suoratoistotietoja ei löytynyt.
                  </p>
                )}

                <small>
                  Katselupalvelutiedot: JustWatch
                </small>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}