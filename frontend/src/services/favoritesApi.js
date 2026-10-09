import axios from "../components/api/tokenHandler.js";

const API_URL = import.meta.env.VITE_API_URL;

// Returns the Authorization header used by protected
// favorite endpoints.
function getAuthHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

// Fetch the authenticated user's saved favorites.
export async function getFavorites(token) {
  try {
    const response = await axios.get(`${API_URL}/favorites`, {
      headers: getAuthHeaders(token),
    });

    return response.data;
  } catch (error) {
    throw new Error("Suosikkien hakeminen epäonnistui", {
      cause: error,
    });
  }
}

// Add one TMDB movie or TV show to favorites.
export async function addFavorite(token, item) {
  try {
    const response = await axios.post(
      `${API_URL}/favorites`,
      {
        tmdbId: item.id,
        mediaType: item.media_type,
      },
      {
        headers: getAuthHeaders(token),
      },
    );

    return response.data;
  } catch (error) {
    throw new Error("Suosikin lisääminen epäonnistui", {
      cause: error,
    });
  }
}

// Remove one favorite.
export async function removeFavorite(token, item) {
  try {
    const response = await axios.delete(
      `${API_URL}/favorites/${item.media_type}/${item.id}`,
      {
        headers: getAuthHeaders(token),
      },
    );

    return response.data;
  } catch (error) {
    throw new Error("Suosikin poistaminen epäonnistui", {
      cause: error,
    });
  }
}

// Create a public share token for the user's favorites.
// Creating a share token requires authentication.
export async function createFavoritesShare(token) {
  try {
    const response = await axios.post(`${API_URL}/favorites/share`, undefined, {
      headers: getAuthHeaders(token),
    });

    return response.data;
  } catch (error) {
    throw new Error("Jakolinkin luominen epäonnistui", {
      cause: error,
    });
  }
}

// Fetch favorites belonging to a public share token.
// PUBLIC: No JWT authentication required.
export async function getSharedFavorites(shareToken) {
  try {
    const response = await axios.get(
      `${API_URL}/favorites/shared/${encodeURIComponent(shareToken)}`,
    );

    return response.data;
  } catch (error) {
    throw new Error("Jaetun suosikkilistan hakeminen epäonnistui", {
      cause: error,
    });
  }
}
