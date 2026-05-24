const {
  pool,
  bcrypt,
  jwt,
  secretKey,
} = require("../../puplic/modules/modules");
const { findUser } = require("../../sql/query");

module.exports = (Login) => {
  Login.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username) {
      return res
        .status(422)
        .json({ error: "Username or password is required", status: 422 });
    }

    if (!password) {
      return res
        .status(422)
        .json({ error: "Username or password is required", status: 422 });
    }

    try {
      // Find user by username
      const result = await pool.query(findUser.findByUsername, [username]);
      const user = result.rows;
      if (!user || user.length === 0) {
        return res.status(401).send({ error: "Unauthorized" });
      }

      const isPasswordValid = await bcrypt.compare(password, user[0].password);
      if (!isPasswordValid) {
        return res.status(403).send({ error: "Invalid password", status: 403 });
      }

      if (user[0].status !== "active") {
        return res.status(403).send({ error: "Unauthorized" });
      }

      const token = jwt.sign(
        { id: user[0].id, username: user[0].username, role: user[0].role },
        secretKey,
        { expiresIn: "1h" },
      );
      return res.status(200).send({ token, role: user[0].role, status: 200 });
    } catch (err) {
      res.status(500).send({ error: err.message, status: 500 });
    }
  });
};
