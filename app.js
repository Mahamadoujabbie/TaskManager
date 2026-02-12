require("dotenv").config();
const express = require("express");
const { pool } = require("./database/db");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const { secretKey } = require("./config/config");
const jwt = require("jsonwebtoken");
const { findUser, insertUser } = require("./sql/SQL");
module.exports = { pool, bcrypt, jwt, secretKey };

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

async function AdminUserCreation() {
  const ADMIN_NAME = process.env.ADMIN_NAME;
  const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  const ADMIN_ROLE = process.env.ADMIN_ROLE;
  const ADMIN_STATUS = process.env.ADMIN_STATUS;

  try {
    const result = await pool.query(findUser.findByUsername, [ADMIN_USERNAME]);
    const existingAdmin = result.rows;

    if (existingAdmin.length > 0) {
      console.log("Admin user already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await pool.query(insertUser.createUser, [
      ADMIN_NAME,
      ADMIN_USERNAME,
      hashedPassword,
      new Date().toISOString().split("T")[0],
      ADMIN_STATUS,
      ADMIN_ROLE,
    ]);
    console.log("Admin user created successfully");
  } catch (err) {
    console.error("Error creating admin user:", err.message);
  }
}

AdminUserCreation();

require("./usersCreation/CreateAccount")(app);
require("./usersCreation/Login")(app);
require("./tasksActions")(app);
require("./userActions/Users")(app);
require("./userActions/UpdateUserStatus")(app);
require("./userActions/DeleteUser")(app);

const PORT = process.env.APPPORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
