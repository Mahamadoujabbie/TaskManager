const { users, bcrypt, jwt, secretKey } = require("../app");

module.exports = (Login) => {
  Login.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
      if (!username) {
        return res
          .status(422)
          .json({ error: "Username or password is required", status: 422 });
      }

      const isUserExist = await users.findOne({ username });
      if (!isUserExist) {
        return res.status(401).send({ error: "Unauthorized", status: 401 });
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        isUserExist.password,
      );
      if (!isPasswordValid) {
        return res.status(403).send({ error: "Invalid password" });
      }

      const token = jwt.sign(
        { id: isUserExist._id, username: isUserExist.username },
        secretKey,
        { expiresIn: "1h" },
      );
      return res.status(200).send({ token, status: 200 });
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  });
};
