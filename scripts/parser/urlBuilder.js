// build the API URL from parameters
function urlBuilder(baseURL, params) {
  var builtURL = baseURL + "?";

  builtURL = builtURL + "&" + new URLSearchParams(params);

  return builtURL;
}

module.exports = { urlBuilder };
