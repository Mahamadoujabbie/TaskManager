const authenticate = require("../middlewares/Authenticate");
const { users, tasks } = require("../app");
const e = require("express");

module.exports = (Tasks) => {
  //this route is for creating a task
  Tasks.post("/createATask", authenticate, async (req, res) => {
    try {
      const { taskTitle, taskDetails, expairesDate } = req.body;
      if (!taskTitle) {
        return res.status(422).send({ error: "Task title is required" });
      }
      if (!taskDetails) {
        return res.status(422).send({ error: "Task details are required" });
      }

      if (!expairesDate) {
        return res.status(422).send({ error: "Expaires date is required" });
      }

      const username = req.me.username;
      const userData = await users.findOne({ username });

      if (!userData) {
        return res.status(401).send({ error: "Unauthorized" });
      }

      if (userData.status === "inactive") {
        return res
          .status(403)
          .send({ error: "Your account is inactive. Please contact support." });
      }

      const isTaskAlreadyExist = await tasks.findOne({
        userId: userData._id,
        title: taskTitle,
      });

      if (isTaskAlreadyExist) {
        return res.status(409).send({ error: "Task already exists" });
      }

      tasks.insert({
        userId: userData._id,
        title: taskTitle,
        task: taskDetails,
        createdAt: new Date().toISOString().split("T")[0],
        expairesAt: expairesDate,
        status: "incompleted",
      });

      const isTaskExist = await tasks.findOne({
        userId: userData._id,
        title: taskTitle,
      });

      // const taskDataToSend = {
      //   title: isTaskExist.title,
      //   createdAt: isTaskExist.createdAt,
      //   expairesAt: isTaskExist.expairesAt,
      // };

      return res.status(201).send({
        message: "Task created successfully",
      });
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  });

  //this route is for getting all tasks of a user
  Tasks.get("/getAll", authenticate, async (req, res) => {
    const username = req.me.username;
    const userData = await users.findOne({ username });

    if (!userData) {
      return res.status(401).send({ error: "Unauthorized" });
    }

    if (userData.status === "inactive") {
      return res
        .status(403)
        .send({ error: "Your account is inactive. Please contact support." });
    }

    const allTasks = await tasks.find({ userId: userData._id });
    if (allTasks.length === 0) {
      return res.status(404).send({ error: "No tasks found" });
    }

    const dataToSendToUser = allTasks.map((task) => ({
      name: userData.name,
      id: task._id,
      title: task.title,
      task: task.task,
      createdAt: task.createdAt,
      expairesAt: task.expairesAt,
      status: task.status,
    }));
    return res.status(200).send(dataToSendToUser);
  });

  Tasks.post("/getTask", authenticate, async (req, res) => {
    const { taskTitle } = req.body;
    const username = req.me.username;
    const userData = await users.findOne({ username });

    if (!userData) {
      return res.status(401).send({ error: "Unauthorized" });
    }

    const isTaskExistByTitle = await tasks.findOne({
      userId: userData._id,
      title: taskTitle,
    });
    if (!isTaskExistByTitle) {
      return res.status(404).send({ error: "Task not found" });
    }

    const taskDataToSend = {
      name: userData.name,
      title: isTaskExistByTitle.title,
      task: isTaskExistByTitle.task,
      createdAt: isTaskExistByTitle.createdAt,
      expairesAt: isTaskExistByTitle.expairesAt,
      status: isTaskExistByTitle.status,
    };
    return res.status(200).send(taskDataToSend);
  });

  //this route is for deleting a task
  Tasks.delete("/deletetask", authenticate, async (req, res) => {
    const { taskTitle } = req.body;
    const username = req.me.username;
    const userData = await users.findOne({ username });

    if (!userData) {
      return res.status(401).send({ error: "Unauthorized" });
    }

    const isTaskExistByTitle = await tasks.findOne({
      userId: userData._id,
      title: taskTitle,
    });
    if (!isTaskExistByTitle) {
      return res.status(404).send({ error: "Task not found" });
    }

    await tasks.remove({ _id: isTaskExistByTitle._id });
    return res.status(200).send({ message: "Task deleted successfully" });
  });

  //this route is for updating a task
  Tasks.put("/updatetask", authenticate, async (req, res) => {
    const { taskTitle, taskDetails } = req.body;
    const username = req.me.username;
    const userData = await users.findOne({ username });

    if (!userData) {
      return res.status(401).send({ error: "Unauthorized" });
    }

    if (userData.status === "inactive") {
      return res
        .status(403)
        .send({ error: "Your account is inactive. Please contact support." });
    }

    const isTaskExistByTitle = await tasks.findOne({
      userId: userData._id,
      title: taskTitle,
    });
    if (!isTaskExistByTitle) {
      return res.status(404).send({ error: "Task not found" });
    }

    const updatedTask = {
      task: taskDetails,
      title: taskTitle,
      userId: userData._id,
      createdAt: isTaskExistByTitle.createdAt,
      expairesAt: isTaskExistByTitle.expairesAt,
      status: isTaskExistByTitle.status,
    };

    await tasks.update({ _id: isTaskExistByTitle._id }, updatedTask);

    return res.status(200).send({ message: "Task updated successfully" });
  });

  Tasks.put("/updatetaskstatus", authenticate, async (req, res) => {
    const { taskTitle, status } = req.body;
    const username = req.me.username;
    const userData = await users.findOne({ username });

    if (!userData) {
      return res.status(401).send({ error: "Unauthorized" });
    }

    if (userData.status === "inactive") {
      return res
        .status(403)
        .send({ error: "Your account is inactive. Please contact support." });
    }

    const isTaskExistByTitle = await tasks.findOne({
      userId: userData._id,
      title: taskTitle,
    });

    if (!isTaskExistByTitle) {
      return res.status(404).send({ error: "Task not found" });
    }

    const updatedTask = {
      task: isTaskExistByTitle.task,
      title: taskTitle,
      userId: userData._id,
      createdAt: isTaskExistByTitle.createdAt,
      expairesAt: isTaskExistByTitle.expairesAt,
      status: status,
    };

    await tasks.update({ _id: isTaskExistByTitle._id }, updatedTask);
    return res
      .status(200)
      .send({ message: "Task status updated successfully" });
  });
};
