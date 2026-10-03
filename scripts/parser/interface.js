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

  await fetchMoviesFromApi(50);
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
  convertDuration();
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

function convertDuration() {
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

      movieMap.get(id).duration = `${hours}:${minutes}:00`;
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
      id: movie.id,
      title: movie.title,
      description: movie.overview,
      duration: "",
      genre: genres,
      release_date: movie.release_date,
    };

    //  Store in map
    movieMap.set(movie.id, movieObject);

    // Progress indicator
    process.stdout.write(`\rMovies loaded: ${movieMap.size}`);
  }
}

main();
