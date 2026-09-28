require("dotenv").config();

const { PrismaClient } = require("../generated/prisma");
const { endpoints } = require("./endpoints.js");

const { api_request } = require("./request.js");
const { custom_args } = require("./getTopRatedMovies.js");
const { urlBuilder } = require("./urlBuilder.js");

var genreMap = new Map();
var movieMap = new Map();
var detailsMap = new Map();

async function main() {
  await getGenres();

  // Depth = number of pages
  // 5 pages = 60 movies.
  // 50 pages = 960 movies.

  await fetchMoviesFromApi(100);
  console.log(movieMap);
}

async function fetchMoviesFromApi(depth) {
  if (depth > 100) {
    depth = 100;
  }
  for (let i = 2; i < depth; i++) {
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
    let runtime = element.runtime;
    let hours = Math.floor(runtime / 60);
    let minutes = runtime % 60;
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    movieMap.get(id).duration = `${hours}:${minutes}:00`;
  });
}

// Sets every necessary attribute from the API Stream to variables
function manageMovies(data) {
  // Saving id is needed to find movie details, needed for duration info

  let title;
  let id;
  let duration;
  let overview;
  let genre;
  let release_date;

  // data variable where all the movie details will be stored
  let detailData;

  // Go thru every entry of data
  for (let i = 0; i < data.length; i++) {
    id = data[i].id;
    title = data[i].title;
    duration = "";
    overview = data[i].overview;
    genre = [];

    for (let j = 0; j < data[i].genre_ids.length; j++) {
      genre.push(genreMap[data[i].genre_ids[j]]);
    }
    release_date = data[i].release_date;

    let movieObject = {
      id: id,
      title: title,
      description: overview,
      duration: duration,
      genre: genre,
      release_date: release_date,
    };

    movieMap.set(id, movieObject);
    process.stdout.write(`\rMovies loaded: ${movieMap.size}`);
  }
}

main();
