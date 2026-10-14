export async function searchTmdb(query, type = "all", year = "") {
  const params = new URLSearchParams({ query, type });

  if (year) {
    params.set("year", year);
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/tmdb/search?${params}`,
  );

  if (!response.ok) {
    throw new Error("Search failed");
  }

  const data = await response.json();

  return data.results || [];
}
