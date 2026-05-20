// database/initTables.js
const pool = require("../config/Database_config");

const userTable = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at DATE,
  status VARCHAR(50),
  role VARCHAR(50)
);
`;

const taskTable = `
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  task TEXT,
  created_at DATE,
  expires_at DATE,
  status VARCHAR(50)
);
`;

async function createTables() {
  try {
    await pool.query(userTable);
    await pool.query(taskTable);
  } catch (err) {
    console.error("Failed to create tables:", err);
    throw err;
  }
}

module.exports = createTables;
