export default function FavoriteButton({
  isAuthenticated,
  isFavorite,
  onToggle
}) {
  // Favorites are available only for authenticated users.
  const handleClick = () => {
    if (!isAuthenticated) {
      alert('Kirjaudu sisään lisätäksesi suosikkeihin.')
      return
    }

    onToggle()
  }

  return (
    <button
      type="button"
      className={`favorite-button ${
        isFavorite ? 'active' : ''
      }`}
      onClick={handleClick}
      title={
        !isAuthenticated
          ? 'Kirjaudu sisään lisätäksesi suosikkeihin'
          : isFavorite
            ? 'Poista suosikeista'
            : 'Lisää suosikkeihin'
      }
    >
      {isFavorite ? '♥' : '♡'}
    </button>
  )
}