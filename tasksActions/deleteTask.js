const authenticate = require("../middlewares/Authenticate");
const { pool } = require("../app");
const { findUser, findTask, insertTask } = require("../sql/sql");

module.exports = (app) => {
  app.delete("/deletetask", authenticate, async (req, res) => {
    const { taskTitle } = req.body;
    const username = req.me.username;
    try {
      const usersResult = await pool.query(findUser.findByUsername, [username]);
      const user = usersResult.rows[0];

      if (!user) {
        return res.status(401).send({ error: "Unauthorized" });
      }

      // Find task by title and userId
      const tasksResult = await pool.query(findTask.findUserIdANDTitle, [
        user.id,
        taskTitle,
      ]);
      const task = tasksResult.rows[0];

      if (!task) {
        return res.status(404).send({ error: "Task not found" });
      }

      // Delete the task
      await pool.query(insertTask.deleteTask, [task.id]);

      return res.status(200).send({ message: "Task deleted successfully" });
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  });
};
