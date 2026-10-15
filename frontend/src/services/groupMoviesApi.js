import axios from "../components/api/authAxios";

// Get movies saved in a group.
export async function getGroupMovies(groupId) {
  try {
    const response = await axios.get(`/groups/${groupId}/movies`);
    return response.data;
  } catch (error) {
    const errMsg = error.response?.data?.error?.message;
    throw new Error(errMsg || "Failed to get group movies", { cause: error });
  }
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
