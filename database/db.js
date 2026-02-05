const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Initialize database tables
const initializeDatabase = async () => {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        _id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        date BIGINT NOT NULL
      );
    `);

    // Create tasks table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        _id SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL,
        title VARCHAR(255) NOT NULL,
        task TEXT NOT NULL,
        "createdAt" TIMESTAMP NOT NULL,
        "expairesAt" VARCHAR(255) NOT NULL,
        FOREIGN KEY ("userId") REFERENCES users(_id) ON DELETE CASCADE
      );
    `);

    console.log("Database tables initialized successfully");
  } catch (err) {
    console.error("Error initializing database:", err);
  }
};

module.exports = { pool, initializeDatabase };
