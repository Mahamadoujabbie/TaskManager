const { pool } = require("../app");
const { findUser } = require("../sql/SQL");
const AdminsAccess = require("../middlewares/AdminAccess");

module.exports = (userApp) => {
  userApp.get("/getAllUsers", AdminsAccess, async (req, res) => {
    try {
      const result = await pool.query(findUser.findAll);
      const users = result.rows;
      const usersToSend = users.map((user) => ({
        id: user.id,
        name: user.name,
        username: user.username,
        status: user.status,
        role: user.role,
      }));

      res.status(200).json({
        users: usersToSend,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};
