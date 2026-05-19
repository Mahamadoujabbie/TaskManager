require("dotenv").config();

const pool = require("../../config/Database_config");
const bcrypt = require("bcryptjs");

const { findUser, insertUser } = require("../../sql/query");

async function seedAdmin() {
  const adminName = process.env.ADMIN_NAME;
  const adminUserName = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminRole = process.env.ADMIN_ROLE || "admin";
  const adminStatus = process.env.ADMIN_STATUS || "active";

  try {
    const result = await pool.query(findUser.findByUsername, [adminUserName]);

    const existingAdmin = result.rows;

    if (existingAdmin.length > 0) {
      console.log("Admin user already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await pool.query(insertUser.createUser, [
      adminName,
      adminUserName,
      hashedPassword,
      new Date().toISOString().split("T")[0],
      adminStatus,
      adminRole,
    ]);

    console.log("Admin created successfully");
  } catch (err) {
    console.error(err.message);
  }
}

module.exports = seedAdmin;
