export default function FavoriteButton({
  isAuthenticated,
  isFavorite,
  onToggle
}) {
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
        isAuthenticated
          ? 'Lisää suosikkeihin'
          : 'Kirjaudu sisään lisätäksesi suosikkeihin'
      }
    >
      {isFavorite ? '♥' : '♡'}
    </button>
  )
}