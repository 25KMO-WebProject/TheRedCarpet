const { exec } = require("child_process");

// Get access token from ../.env -file
const access_key = process.env.TMDB_ACCESS_TOKEN;

// Add header information for the GET -call

// Check if there actually is Access token..
if (!access_key) {
  console.log("Cant find TMDB access token..");
  process.exit(1);
}

// Build API GET curl from parameters..
function api_request(api_url, endpoint, callback) {
  var curlCommand = `curl --request GET \
	--url "${api_url}" \
	--header "accept: application/json"`;

  if (endpoint.auth) {
    curlCommand += ` \
		--header "Authorization: Bearer ${access_key}"`;
  }

  exec(curlCommand, (error, stdout, stderr) => {
    if (error) {
      console.log(error);
      return;
    }
    const data = JSON.parse(stdout);
    callback(data);
  });
}

module.exports = { api_request };
