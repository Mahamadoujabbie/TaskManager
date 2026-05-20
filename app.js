// System imports
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// App imports
const seedAdmin = require("./puplic/seeder/Seeder");
const routes = require("./puplic/routes/Routes");
const createTables = require("./sql/Tables");

// Export dependencies for other modules to use

// app initializations
const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("combined"));
// Initialize database tables and seed admin user, then start the server
createTables()
  .then(() => seedAdmin())
  .catch((err) => {
    console.error("DB init failed, exiting:", err);
    process.exit(1);
  });
routes(app);

// Start the server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
