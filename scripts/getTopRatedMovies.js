const now = new Date();

var release_date_start = "1900-01-01";
var release_date_end = "1974-09-30";

release_date_end = now.toLocaleDateString();

var custom_args = {
  include_adult: false,
  include_video: false,
  language: "en-US", //default "en-US"
  page: 1,
  sort_by: "vote_average.desc",
  without_genres: "99,10755",
  "vote_count.gte": 200,
  "release_date.gte": release_date_start,
  "release_date.lte": release_date_end,
};

module.exports = {
  custom_args,
};
