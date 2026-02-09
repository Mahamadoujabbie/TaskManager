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
        date BIGINT NOT NULL,
        status VARCHAR(50) DEFAULT 'active' NOT NULL
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
        status VARCHAR(50) DEFAULT 'incompleted' NOT NULL,
        FOREIGN KEY ("userId") REFERENCES users(_id) ON DELETE CASCADE
      );
    `);

    // Add status column to existing tables if they don't have it
    await pool.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='users' AND column_name='status'
        ) THEN
          ALTER TABLE users ADD COLUMN status VARCHAR(50) DEFAULT 'active' NOT NULL;
        END IF;
      END $$;
    `);

    await pool.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='tasks' AND column_name='status'
        ) THEN
          ALTER TABLE tasks ADD COLUMN status VARCHAR(50) DEFAULT 'incompleted' NOT NULL;
        END IF;
      END $$;
    `);

    console.log("Database tables initialized successfully");
  } catch (err) {
    console.error("Error initializing database:", err);
  }
};

module.exports = { pool, initializeDatabase };
