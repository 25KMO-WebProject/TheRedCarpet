require("dotenv").config();
const { exec } = require("child_process");

var api_url = "https://api.themoviedb.org/3/movie";

const top_url = "https://api.themoviedb.org/3/movie/top_rated";
const test_url =
  "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=vote_average.desc&without_genres=99,10755&vote_count.gte=200";
const access_key = process.env.TMDB_ACCESS_TOKEN;
const headers = [
  `Authorization: Bearer ${access_key}`,
  "accept: application/json",
];

//api_url = test_url;
api_url = top_url;

// Check if there actually is Access token..
if (!access_key) {
  console.log("Cant find TMDB access token..");
  process.exit(1);
}

console.log(`URL: ${api_url}`);

// Build curl command
const curlCommand = `curl --request GET \
	--url "${api_url}" \
	--header "${headers[0]}" \
	--header "${headers[1]}"`;

console.log("Executing command:");
console.log(curlCommand);
console.log("\n\n\n\n");

// Execute the command
exec(curlCommand, (error, stdout, stderr) => {
  if (error) {
    console.log(`Error: ${error}`);
    return;
  }
  const data = JSON.parse(stdout);
  console.log(data);
  if (stderr) {
    console.log(`Errors: ${stderr}`);
  }
});
