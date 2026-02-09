const { users, bcrypt } = require("../app");

module.exports = (SignUp) => {
  SignUp.post("/create", async (req, res) => {
    try {
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

      if (await users.findOne({ username })) {
        return res.status(409).send({ error: "Username already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await users.insert({
        name,
        username,
        password: hashedPassword,
        Date: new Date().getDate(),
        status: "active",
      });
      return res.status(201).send({
        message: "User created successfully",
      });
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  });
};
