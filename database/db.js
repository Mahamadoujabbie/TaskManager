require("dotenv").config();
// PostgreSQL connection (Render compatible)
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.HOST,
  port: process.env.PORT || 5432,
  database: process.env.NAME,
  user: process.env.USER,
  password: process.env.PASSWORD,
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
    console.error("Check your environment variables: HOST, PORT, NAME, USER, PASSWORD");
  });

module.exports = { pool };
