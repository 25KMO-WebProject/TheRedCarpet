const endpoints = {
  getMovies: {
    path: "https://api.themoviedb.org/3/discover/movie",
    auth: true,
  },

  getGenres: {
    path: "https://api.themoviedb.org/3/genre/movie/list?language=en",
    auth: true,
  },

  getMovieDetails: {
    path: "https://api.themoviedb.org/3/movie",
    auth: true,
  },
};

module.exports = { endpoints };
