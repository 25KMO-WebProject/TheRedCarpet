import { expect } from "chai";

const apiUrl = "http://localhost:3001";

// This user comes from database/seed.sql.
const testUser = {
  account: "adam@example.com",
  password: "Adam!#Test",
};

describe("Login", () => {

  // Positive test: correct credentials should allow login.
  it("should login with correct credentials", async () => {
    const response = await fetch(
      `${apiUrl}/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testUser),
      }
    );

    const data = await response.json();

    expect(response.status).to.equal(200);

    expect(data).to.include.all.keys(
      "id",
      "email",
      "token"
    );

    expect(data.token).to.be.a("string");
  });


  // Negative test: wrong password should not allow login.
  it("should not login with wrong password", async () => {
    const response = await fetch(
      `${apiUrl}/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account: testUser.account,
          password: "WrongPassword123!!",
        }),
      }
    );

    const data = await response.json();

    expect(response.status).to.equal(401);
    expect(data).to.not.have.property("token");
  });


  // Negative test: password is required.
  it("should not login without password", async () => {
    const response = await fetch(
      `${apiUrl}/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account: testUser.account,
        }),
      }
    );

    expect(response.status).to.equal(400);
  });

});