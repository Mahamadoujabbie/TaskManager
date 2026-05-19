const authenticate = require("../middlewares/Authenticate");
const { pool } = require("../../puplic/modules/modules");
const { findUser, findTask, insertTask } = require("../../sql/query");

module.exports = (app) => {
  app.post("/createATask", authenticate, async (req, res) => {
    const { taskTitle, taskDetails, expairesAt } = req.body;
    if (!taskTitle) {
      return res.status(422).send({ error: "Task title is required" });
    }
    if (!taskDetails) {
      return res.status(422).send({ error: "Task details are required" });
    }

    if (!expairesAt) {
      return res.status(422).send({ error: "Expires date is required" });
    }

    const username = req.me.username;

    try {
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

      const tasksResult = await pool.query(findTask.findUserIdANDTitle, [
        user.id,
        taskTitle,
      ]);
      const tasks = tasksResult.rows;

      if (tasks.length > 0) {
        return res.status(409).send({ error: "Task already exists" });
      }

      // Insert new task
      await pool.query(insertTask.createTask, [
        user.id,
        taskTitle,
        taskDetails,
        new Date().toISOString().split("T")[0],
        expairesAt,
        "incomplete",
      ]);

      return res.status(201).send({
        message: "Task created successfully",
      });
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  });
};
