
const apiUrl = import.meta.env.VITE_API_URL;

// Get movies saved in a group.
export async function getGroupMovies(groupId, token) {
  const response = await fetch(
    `${apiUrl}/groups/${groupId}/movies`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get group movies");
  }

  return response.json();
}

// Add a movie or TV show to a group.
export async function addGroupMovie(groupId, item, token) {
  const response = await fetch(
    `${apiUrl}/groups/${groupId}/movies`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tmdbId: item.id,
        mediaType: item.media_type,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to add movie to group");
  }

  return response.json();
}
