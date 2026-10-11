import { expect } from "chai";

const apiUrl = "http://localhost:3001";

const testUser = {
  account: "adam@example.com",
  password: "Adam!#Test",
};

describe("Logout", () => {

  // Positive test: a valid token should allow logout.
  it("should logout with a valid token", async () => {
    // Login first to get a valid JWT token.
    const loginResponse = await fetch(
      `${apiUrl}/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testUser),
      }
    );

    const loginData = await loginResponse.json();

    expect(loginResponse.status).to.equal(200);

    const response = await fetch(
      `${apiUrl}/logout`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${loginData.token}`,
        },
      }
    );

    const data = await response.json();

    expect(response.status).to.equal(200);
    expect(data.message).to.equal(
      "Logged out successfully"
    );
  });


  // Negative test: logout requires a token.
  it("should not logout without a token", async () => {
    const response = await fetch(
      `${apiUrl}/logout`,
      {
        method: "POST",
      }
    );

    expect(response.status).to.equal(401);
  });

});