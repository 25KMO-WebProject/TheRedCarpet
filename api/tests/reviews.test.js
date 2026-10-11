import { expect } from "chai";

const apiUrl = "http://localhost:3001";

// The Matrix exists in the seeded test database.
// Its TMDB id is 603 and it already has a review.
const testMovieId = 603;

describe("Reviews", () => {

  // Positive test: an existing movie should return its reviews.
  it("should return reviews for an existing movie", async () => {
    const response = await fetch(
      `${apiUrl}/reviews/${testMovieId}`
    );

    const data = await response.json();

    // The response should be array.
    expect(response.status).to.equal(200);
    expect(data).to.be.an("array");
    expect(data.length).to.be.greaterThan(0);

    // Each review should have the expected keys.
    expect(data[0]).to.include.all.keys(
      "rating",
      "description",
      "date",
      "username"
    );
  });


  // Negative test: a movie that does not exist should return 404.
  it("should return 404 for a movie that does not exist", async () => {
    const response = await fetch(
      `${apiUrl}/reviews/99999999`
    );

    expect(response.status).to.equal(404);
  });


  // Negative test: movie id must be a valid number.
  it("should return 400 for an invalid movie id", async () => {
    const response = await fetch(
      `${apiUrl}/reviews/invalid`
    );

    expect(response.status).to.equal(400);
  });

});