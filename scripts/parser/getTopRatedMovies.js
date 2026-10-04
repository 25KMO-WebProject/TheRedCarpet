const today = new Date();
const current_date = today.toISOString().split("T")[0]; // Gets YYYY-MM-DD format

const release_date_start = "1800-01-01";
const release_date_end = current_date;

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
