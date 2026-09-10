import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/movies/nowplaying`)
      .then((response) => {
        setMovies(response.data);
      });
  }, []);

  return (
    <main>
      <h1>Now at Theaters</h1>

      <div className="movie-grid">
        {movies.map((movie) => (
          <div className="movie-card" key={movie.id}>
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
            ) : (
              <div className="no-poster">No poster</div>
            )}

            <h2>{movie.title}</h2>

            <p>⭐ {movie.vote_average?.toFixed(1)}</p>

            <p>{movie.release_date}</p>

            <p>{movie.genres.join(", ")}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
