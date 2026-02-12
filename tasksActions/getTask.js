const authenticate = require("../middlewares/Authenticate");
const { pool } = require("../app");
const { findUser, findTask } = require("../sql/sql");

module.exports = (app) => {
  app.post("/getTask", authenticate, async (req, res) => {
    try {
      const { taskTitle } = req.body;
      const username = req.me.username;

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

      const taskDataToSend = {
        name: user.name,
        title: task.title,
        task: task.task,
        createdAt: task.createdAt,
        expairesAt: task.expairesAt,
        status: task.status,
      };
      return res.status(200).send(taskDataToSend);
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  });
};
