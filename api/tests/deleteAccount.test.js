import { expect } from "chai";

const apiUrl = "http://localhost:3001";

// Create a unique account for these tests.
const uniqueId = Date.now().toString().slice(-6);

const testUser = {
  username: `delete${uniqueId}`,
  email: `delete${uniqueId}@example.com`,
  password: "DeletePass1",
};

let accountId = null;

describe("Delete account", () => {

  // Create account that can be used in the delete tests.
  before(async () => {
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

    accountId = data.id;
  });


  // Negative test: wrong password must not delete the account.
  it("should not delete account with wrong password", async () => {
    const response = await fetch(
      `${apiUrl}/accounts/id/${accountId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account: testUser.email,
          password: "WrongPassword123",
        }),
      }
    );

    expect(response.status).to.equal(401);

    // The account should still be able to log in.
    const loginResponse = await fetch(
      `${apiUrl}/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account: testUser.email,
          password: testUser.password,
        }),
      }
    );

    expect(loginResponse.status).to.equal(200);
  });


  // Positive test: correct credentials should delete the account.
  it("should delete account with correct credentials", async () => {
    const response = await fetch(
      `${apiUrl}/accounts/id/${accountId}`,
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

    const data = await response.json();

    expect(response.status).to.equal(200);
    expect(data.id).to.equal(accountId);

    // After deletion the same credentials must no longer work.
    const loginResponse = await fetch(
      `${apiUrl}/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account: testUser.email,
          password: testUser.password,
        }),
      }
    );

    expect(loginResponse.status).to.equal(401);

    accountId = null;
  });


  // Cleanup only if a previous test failed before deleting the account.
  after(async () => {
    if (!accountId) {
      return;
    }

    await fetch(
      `${apiUrl}/accounts/id/${accountId}`,
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