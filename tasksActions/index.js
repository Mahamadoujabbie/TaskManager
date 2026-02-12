module.exports = (app) => {
  require("./createTask")(app);
  require("./getAllTasks")(app);
  require("./getTask")(app);
  require("./deleteTask")(app);
  require("./updateTask")(app);
  require("./updateTaskStatus")(app);
};
