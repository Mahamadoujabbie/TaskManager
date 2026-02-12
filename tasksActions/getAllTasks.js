const authenticate = require("../middlewares/Authenticate");
const { pool } = require("../app");
const { findUser, findTask } = require("../sql/SQL");

module.exports = (app) => {
  app.get("/getAll", authenticate, async (req, res) => {
    try {
      const username = req.me.username;

      const usersResult = await pool.query(findUser.findByUsername, [username]);
      const user = usersResult.rows[0];

      if (!user) {
        return res.status(401).send({ error: "Unauthorized" });
      }

      if (user.status === "inactive") {
        return res
          .status(403)
          .send({ error: "Your account is inactive. Please contact support." });
      }

      // Get all tasks for user
      const tasksResult = await pool.query(findTask.findByUserId, [user.id]);
      const allTasks = tasksResult.rows;

      if (allTasks.length === 0) {
        return res.status(404).send({ error: "No tasks found" });
      }

      const dataToSendToUser = allTasks.map((task) => ({
        name: user.name,
        id: task.id,
        title: task.title,
        task: task.task,
        createdAt: task.createdAt,
        expairesAt: task.expairesAt,
        status: task.status,
      }));
      return res.status(200).send(dataToSendToUser);
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  });
};
