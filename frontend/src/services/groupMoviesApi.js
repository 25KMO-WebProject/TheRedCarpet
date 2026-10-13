import axios from "../components/api/authAxios";

const apiUrl = import.meta.env.VITE_API_URL;

// Get movies saved in a group.
export async function getGroupMovies(groupId, token) {
  const response = await fetch(`${apiUrl}/groups/${groupId}/movies`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get group movies");
  }

  return response.json();
}

// Add a movie or TV show to a group.
export async function addGroupMovie(groupId, item) {
  try {
    const response = await axios.post(`/groups/${groupId}/movies`, {
      tmdbId: item.id,
      mediaType: item.media_type,
    });

    return response.data;
  } catch (error) {
    const errMsg = error.response?.data?.error?.message;

    throw new Error(errMsg || "Failed to add movie to group", { cause: error });
  }
}
