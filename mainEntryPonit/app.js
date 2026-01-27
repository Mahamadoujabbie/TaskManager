const express = require("express");
const Datastore = require("nedb-promises");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const { secretKey } = require("../config/config");
const jwt = require("jsonwebtoken");

const users = Datastore.create("database/Users.db");
const tasks = Datastore.create("database/Tasks.db");
module.exports = { users, tasks, bcrypt, jwt, secretKey };

const app = express();
app.use(cors());
app.use(express.json());

require("../usersCreation/CreateAccount")(app);
require("../usersCreation/Login")(app);
require("../userActions/Tasks")(app);

module.exports = app;
