// User authentication routes
const CreateAccount = require("../../src/usersCreation/CreateAccount");
const Login = require("../../src/usersCreation/Login");
const Oauth2 = require("../../src/usersCreation/Oauth2");

// Task management routes
const createTask = require("../../src/tasksActions/createTask");
const deleteTask = require("../../src/tasksActions/deleteTask");
const getAllTasks = require("../../src/tasksActions/getAllTasks");
const getTask = require("../../src/tasksActions/getTask");
const updateTask = require("../../src/tasksActions/updateTask");
const updateTaskStatus = require("../../src/tasksActions/updateTaskStatus");

// user management routes
const Users = require("../../src/userActions/Users");
const UpdateUserStatus = require("../../src/userActions/UpdateUserStatus");
const DeleteUser = require("../../src/userActions/DeleteUser");

function routes(app) {
  CreateAccount(app);
  Login(app);
  Oauth2(app);

  //tasksActions(app);

  Users(app);
  UpdateUserStatus(app);
  DeleteUser(app);
}

module.exports = routes;
