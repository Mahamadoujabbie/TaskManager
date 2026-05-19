// System imports
require("dotenv").config();
const express = require("express");
const cors = require("cors");

// App imports
const seedAdmin = require("./puplic/seeder/Seeder");
const routes = require("./puplic/routes/Routes");

// Export dependencies for other modules to use

// app initializations
const app = express();
app.use(express.json());
app.use(cors());

seedAdmin();
routes(app);

const port = process.env.DB_PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
