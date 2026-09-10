import express from "express";

const router = express.Router();

router.get("/nowplaying", async (req, res) => {
  const response = await fetch(
    "https://api.themoviedb.org/3/movie/now_playing?language=fi-FI&region=FI",
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        accept: "application/json",
      },
    }
  );

  const data = await response.json();

  const genresResponse = await fetch(
    "https://api.themoviedb.org/3/genre/movie/list?language=fi-FI",
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        accept: "application/json",
      },
    }
  );

  const genresData = await genresResponse.json();

  const movies = data.results.slice(0, 5).map((movie) => ({
    ...movie,
    genres: movie.genre_ids.map((id) => {
      const genre = genresData.genres.find((genre) => genre.id === id);
      return genre ? genre.name : "";
    }),
  }));

  res.json(movies);
});

export default router;
