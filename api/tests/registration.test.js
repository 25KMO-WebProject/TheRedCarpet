import { expect } from "chai";

const apiUrl = "http://localhost:3001";

// Use unique user so the test can be run repeatedly.
const uniqueId = Date.now().toString().slice(-6);

const testUser = {
  username: `reg${uniqueId}`,
  email: `reg${uniqueId}@example.com`,
  password: "TestPass1",
};

let createdUserId = null;

describe("Registration", () => {

  // Positive test: valid information should create a new account.
  it("should register a new user", async () => {
    const response = await fetch(
      `${apiUrl}/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testUser),
      }
    );

    const data = await response.json();

    expect(response.status).to.equal(201);

    expect(data).to.include.all.keys(
      "id",
      "username",
      "email"
    );

    expect(data.email).to.equal(testUser.email);

    // Save the id so the test user can be removed afterwards.
    createdUserId = data.id;
  });


  // Negative test: password is too short.
  it("should not register with a short password", async () => {
    const response = await fetch(
      `${apiUrl}/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: `short${uniqueId}`,
          email: `short${uniqueId}@example.com`,
          password: "Test1",
        }),
      }
    );

    expect(response.status).to.equal(400);
  });


  // Negative test: email is required.
  it("should not register without email", async () => {
    const response = await fetch(
      `${apiUrl}/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: `noemail${uniqueId}`,
          password: "TestPass1",
        }),
      }
    );

    expect(response.status).to.equal(400);
  });


  // Remove the account created by the positive test.
  after(async () => {
    if (!createdUserId) {
      return;
    }

    await fetch(
      `${apiUrl}/accounts/id/${createdUserId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account: testUser.email,
          password: testUser.password,
        }),
      }
    );
  });

});