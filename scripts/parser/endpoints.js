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

  poster: {
    path: "https://image.tmdb.org/t/p/w600_and_h900_face",
    auth: false,
  },

  thumbnail: {
    path: "https://image.tmdb.org/t/p/w342/",
    auth: false,
  },
};

module.exports = { endpoints };
