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

  await fetchMoviesFromApi(5);
  await importMovies(movieMap);
}

async function fetchMoviesFromApi(depth) {
  for (let page = 1; page <= depth; page++) {
    custom_args.page = page;

    console.log(`\n\nCurrent page: ${page}/${depth}`);
    console.log(`Movies in movieMap: ${movieMap.size}`);
    console.log(`Details in detailsMap: ${detailsMap.size}`);

    await getMovies();
    await manageDetails();

    await wait(2000);
  }
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
  const pendingIds = [...movieMap.keys()].filter((id) => !detailsMap.has(id));

  const batchSize = 5;
  let count = 0;

  for (let i = 0; i < pendingIds.length; i += batchSize) {
    const batch = pendingIds.slice(i, i + batchSize);

    await Promise.all(
      batch.map(async (id) => {
        const details = await getMovieDetails(id);

        detailsMap.set(id, details);
        count++;

        process.stdout.write(`\rDetails loaded: ${count}/${pendingIds.length}`);
      }),
    );

    // Wait before the next batch
    if (i + batchSize < pendingIds.length) {
      await wait(500);
    }
  }

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
    };

    //  Store in map
    movieMap.set(movie.id, movieObject);

    // Progress indicator
    process.stdout.write(`\rMovies loaded: ${movieMap.size}`);
  }
}

main();
