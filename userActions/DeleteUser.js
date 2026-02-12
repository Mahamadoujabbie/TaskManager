const { pool } = require("../app");
const { insertUser } = require("../sql/sql");
const AdminsAccess = require("../middlewares/AdminAccess");

module.exports = (remove) => {
  remove.delete("/user/delete/:id", AdminsAccess, async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const result = await pool.query(insertUser.deleteUser, [id]);

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({
        message: "User deleted successfully",
        Id: id,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};
