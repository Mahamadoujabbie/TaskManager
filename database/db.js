require("dotenv").config();
// PostgreSQL connection (Render compatible)
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false, // Required for Render
  },
});

// Test connection
pool
  .connect()
  .then((client) => {
    console.log("Connected to PostgreSQL database");
    client.release();
  })
  .catch((err) => {
    console.error("Error connecting to PostgreSQL database:", err.message);
    console.error(
      "Check your environment variables: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD",
    );
  });

module.exports = { pool };
