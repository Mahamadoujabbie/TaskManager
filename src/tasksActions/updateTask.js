const authenticate = require("../middlewares/Authenticate");
const { pool } = require("../../puplic/modules/modules");
const { findUser, findTask, insertTask } = require("../../sql/query");

module.exports = (app) => {
  app.put("/updatetask", authenticate, async (req, res) => {
    try {
      const { taskTitle, taskDetails } = req.body;
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

      // Find task by title and userId
      const tasksResult = await pool.query(findTask.findUserIdANDTitle, [
        user.id,
        taskTitle,
      ]);
      const task = tasksResult.rows[0];

      if (!task) {
        return res.status(404).send({ error: "Task not found" });
      }

      // Update the task
      await pool.query(insertTask.updateTaskDetails, [taskDetails, task.id]);

      return res.status(200).send({ message: "Task updated successfully" });
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  });
};
