const express = require("express");
const { pool, initializeDatabase } = require("../database/db");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const { secretKey } = require("../config/config");
const jwt = require("jsonwebtoken");

// Initialize database tables on startup
initializeDatabase();

// Create wrapper objects to maintain API compatibility with nedb
const users = {
  insert: async (userData) => {
    const { name, username, password, Date } = userData;
    const result = await pool.query(
      "INSERT INTO users (name, username, password, date) VALUES ($1, $2, $3, $4) RETURNING _id, name, username, password, date",
      [name, username, password, Date],
    );
    return result.rows[0];
  },

  findOne: async (query) => {
    let sql = "SELECT * FROM users WHERE 1=1";
    const params = [];
    let paramIndex = 1;

    if (query.username) {
      sql += ` AND username = $${paramIndex}`;
      params.push(query.username);
      paramIndex++;
    }
    if (query._id) {
      sql += ` AND _id = $${paramIndex}`;
      params.push(query._id);
      paramIndex++;
    }

    const result = await pool.query(sql, params);
    return result.rows[0] || null;
  },

  find: async (query) => {
    let sql = "SELECT * FROM users WHERE 1=1";
    const params = [];
    let paramIndex = 1;

    if (query.username) {
      sql += ` AND username = $${paramIndex}`;
      params.push(query.username);
      paramIndex++;
    }

    const result = await pool.query(sql, params);
    return result.rows;
  },
};

const tasks = {
  insert: async (taskData) => {
    const { userId, title, task, createdAt, expairesAt } = taskData;
    const result = await pool.query(
      'INSERT INTO tasks ("userId", title, task, "createdAt", "expairesAt") VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, title, task, createdAt, expairesAt],
    );
    return result.rows[0];
  },

  findOne: async (query) => {
    let sql = "SELECT * FROM tasks WHERE 1=1";
    const params = [];
    let paramIndex = 1;

    if (query.userId) {
      sql += ` AND "userId" = $${paramIndex}`;
      params.push(query.userId);
      paramIndex++;
    }
    if (query.title) {
      sql += ` AND title = $${paramIndex}`;
      params.push(query.title);
      paramIndex++;
    }
    if (query._id) {
      sql += ` AND _id = $${paramIndex}`;
      params.push(query._id);
      paramIndex++;
    }

    const result = await pool.query(sql, params);
    return result.rows[0] || null;
  },

  find: async (query) => {
    let sql = "SELECT * FROM tasks WHERE 1=1";
    const params = [];
    let paramIndex = 1;

    if (query.userId) {
      sql += ` AND "userId" = $${paramIndex}`;
      params.push(query.userId);
      paramIndex++;
    }

    const result = await pool.query(sql, params);
    return result.rows;
  },

  update: async (query, updateData) => {
    const setClauses = [];
    const params = [];
    let paramIndex = 1;

    Object.keys(updateData).forEach((key) => {
      if (key !== "_id") {
        setClauses.push(`"${key}" = $${paramIndex}`);
        params.push(updateData[key]);
        paramIndex++;
      }
    });

    let sql = `UPDATE tasks SET ${setClauses.join(", ")} WHERE 1=1`;

    if (query._id) {
      sql += ` AND _id = $${paramIndex}`;
      params.push(query._id);
    }

    await pool.query(sql, params);
  },

  remove: async (query) => {
    let sql = "DELETE FROM tasks WHERE 1=1";
    const params = [];
    let paramIndex = 1;

    if (query._id) {
      sql += ` AND _id = $${paramIndex}`;
      params.push(query._id);
      paramIndex++;
    }

    await pool.query(sql, params);
  },
};

module.exports = { users, tasks, bcrypt, jwt, secretKey };

const app = express();
app.use(cors());
app.use(express.json());

require("../usersCreation/CreateAccount")(app);
require("../usersCreation/Login")(app);
require("../userActions/Tasks")(app);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
