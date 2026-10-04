require("dotenv").config();

const { endpoints } = require("./endpoints.js");

const { api_request } = require("./request.js");
const { custom_args } = require("./getTopRatedMovies.js");
const { urlBuilder } = require("./urlBuilder.js");
const { importMovies } = require("./poolBuilder.js");

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const genreMap = new Map();
const movieMap = new Map();
const detailsMap = new Map();

async function main() {
  // Get available movie genres from API
  await getGenres();

  await fetchMoviesFromApi(10);
  await importMovies(movieMap);
}

async function fetchMoviesFromApi(depth) {
  for (let i = 1; i <= depth; i++) {
    if (i % 5 == 0) {
      await wait(2000);
    }
    custom_args.page = i;
    await getMovies();
  }
  await manageDetails();
}

// Get movies from the API stream with custom or default parameters
function getMovies() {
  var endpoint = endpoints.getMovies;
  const url = urlBuilder(endpoint.path, custom_args);

  return new Promise((resolve, reject) => {
    api_request(url, endpoint, (data) => {
      manageMovies(data.results);
      resolve();
    });
  });
}

function getMovieDetails(id) {
  var endpoint = endpoints.getMovieDetails;
  const url = endpoint.path + "/" + id;

  return new Promise((resolve, reject) => {
    api_request(url, endpoint, (data) => {
      resolve(data);
    });
  });
}

// Get details of every movie in movieMap
async function manageDetails() {
  // Array of promises
  const promises = [];

  let count = 0;

  movieMap.forEach((movie, id) => {
    promises.push(
      getMovieDetails(id).then((details) => {
        detailsMap.set(id, details);
        count++;
        process.stdout.write(`\rDetails loaded: ${count}/${movieMap.size}`);
      }),
    );
  });
  await Promise.all(promises);
  assignDetails();
}

// Get movie genres from the API stream and Map them
function getGenres(endpoint) {
  var endpoint = endpoints.getGenres;
  const url = urlBuilder(endpoint.path);

  return new Promise((resolve, reject) => {
    api_request(url, endpoint, (data) => {
      genresToMap(data.genres);
      resolve();
    });
  });
}

// For loop to go through all API stream genres.
function genresToMap(data) {
  for (let i = 0; i < data.length; i++) {
    genreMap[data[i].id] = data[i].name;
  }
}

function assignDetails() {
  // Duration
  detailsMap.forEach((element, id) => {
    if (typeof element.runtime !== "number") {
      console.log("\n\nWarning! Element runtime NOT number format!\n\n");
      console.log(element);
    } else {
      let runtime = element.runtime;
      let hours = Math.floor(runtime / 60);
      let minutes = runtime % 60;
      if (minutes < 10) {
        minutes = `0${minutes}`;
      }

      const movie = movieMap.get(id);
      const detail = detailsMap.get(id);

      movie.duration = `${hours}:${minutes}:00`;

      // Assign image URL paths
      const poster_path = endpoints.poster.path;
      const thumbnail_path = endpoints.thumbnail.path;

      movie.poster_path = poster_path + detail.poster_path;
      movie.backdrop_path = poster_path + detail.backdrop_path;
      movie.small_poster_path = thumbnail_path + detail.poster_path;
      movie.small_backdrop_path = thumbnail_path + detail.backdrop_path;
    }
  });
}

// Sets every necessary attribute from the API Stream to variables
function manageMovies(data) {
  // Go thru every entry of data
  for (let i = 0; i < data.length; i++) {
    const movie = data[i];

    // Get genres from the genreMap
    const genres = movie.genre_ids
      .map((genreId) => genreMap[genreId])
      .filter(Boolean);

    const movieObject = {
      tmdb_id: movie.id,
      title: movie.title,
      description: movie.overview,
      duration: "",
      genre: genres,
      release_date: movie.release_date,
      backdrop_path: "",
      poster_path: "",
      small_backdrop_path: "",
      small_poster_path: "",
    };

    //  Store in map
    movieMap.set(movie.id, movieObject);

    // Progress indicator
    process.stdout.write(`\rMovies loaded: ${movieMap.size}`);
  }
}

main();
