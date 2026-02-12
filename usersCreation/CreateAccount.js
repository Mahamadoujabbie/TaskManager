const { pool, bcrypt } = require("../app");
const { findUser, insertUser } = require("../sql/sql");

module.exports = (SignUp) => {
  SignUp.post("/create", async (req, res) => {
    const { username, password, name } = req.body;
    if (!username) {
      return res.status(422).send({ error: "Username is required" });
    }
    if (!password) {
      return res.status(422).send({ error: "Password is required" });
    }

    if (!name) {
      return res.status(422).send({ error: "Name is required" });
    }

    if (password.length < 8) {
      return res
        .status(403)
        .send({ error: "password is less than 8 characters" });
    }
    if (!username.includes("@")) {
      return res.status(403).send({ error: "Username has invalid format" });
    }

    try {
      // Check if user already exists
      const result = await pool.query(findUser.findByUsername, [username]);
      const existingUser = result.rows;

      if (existingUser.length > 0 && existingUser[0].username === username) {
        return res.status(409).send({ error: "Username already exists" });
      }

      // Create new user
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query(insertUser.createUser, [
        name,
        username,
        hashedPassword,
        new Date(),
        "active",
        "user",
      ]);

      return res.status(201).send({
        message: "User created successfully",
      });
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  });
};
