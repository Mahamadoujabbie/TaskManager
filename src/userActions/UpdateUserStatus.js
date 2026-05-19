const AdminsAccess = require("../middlewares/AdminAccess");
const { pool } = require("../../puplic/modules/modules");
const { insertUser, findUser } = require("../../sql/query");

module.exports = (updateStatus) => {
  updateStatus.put("/user/status/:id", AdminsAccess, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!id) {
        return res.status(400).json({ error: "User ID is required" });
      }

      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }

      const validStatuses = ["active", "inactive"];
      if (!validStatuses.includes(status)) {
        return res
          .status(400)
          .json({ error: "Status must be 'active' or 'inactive'" });
      }

      // Check if user exists
      const usersResult = await pool.query(findUser.findById, [id]);
      const users = usersResult.rows;
      if (users.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      // Update user status
      const result = await pool.query(insertUser.updateUserStatus, [
        status,
        id,
      ]);

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({
        message: "User status updated successfully",
        userId: id,
        newStatus: status,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};
