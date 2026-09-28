const API_URL = import.meta.env.VITE_API_URL


// Returns the Authorization header used by protected
// favorite endpoints.
function getAuthHeaders(token) {
  return {
    Authorization: `Bearer ${token}`
  }
}


// Fetch the authenticated user's saved favorites.
export async function getFavorites(token) {
  const response = await fetch(
    `${API_URL}/favorites`,
    {
      headers: getAuthHeaders(token)
    }
  )

  if (!response.ok) {
    throw new Error(
      'Suosikkien hakeminen epäonnistui'
    )
  }

  return response.json()
}


// Add one TMDB movie or TV show to favorites.
export async function addFavorite(
  token,
  item
) {
  const response = await fetch(
    `${API_URL}/favorites`,
    {
      method: 'POST',
      headers: {
        ...getAuthHeaders(token),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tmdbId: item.id,
        mediaType: item.media_type
      })
    }
  )

  if (!response.ok) {
    throw new Error(
      'Suosikin lisääminen epäonnistui'
    )
  }

  return response.json()
}


// Remove one favorite.
export async function removeFavorite(
  token,
  item
) {
  const response = await fetch(
    `${API_URL}/favorites/${item.media_type}/${item.id}`,
    {
      method: 'DELETE',
      headers: getAuthHeaders(token)
    }
  )

  if (!response.ok) {
    throw new Error(
      'Suosikin poistaminen epäonnistui'
    )
  }

  return response.json()
}


// Create a public share token for the user's favorites.
export async function createFavoritesShare(
  token
) {
  const response = await fetch(
    `${API_URL}/favorites/share`,
    {
      method: 'POST',
      headers: getAuthHeaders(token)
    }
  )

  if (!response.ok) {
    throw new Error(
      'Jakolinkin luominen epäonnistui'
    )
  }

  return response.json()
}


// Fetch favorites belonging to a public share token.
export async function getSharedFavorites(
  shareToken
) {
  const response = await fetch(
    `${API_URL}/favorites/shared/${shareToken}`
  )

  if (!response.ok) {
    throw new Error(
      'Jaetun suosikkilistan hakeminen epäonnistui'
    )
  }

  return response.json()
}