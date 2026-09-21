import { pool } from "./db.js";

const createAccount = async (username, email, hashedPassword) => {
  const result = await pool.query(
    `INSERT INTO account (username, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, username, email`,
    [username, email, hashedPassword]
  );

  return result.rows[0];
};

export { createAccount };