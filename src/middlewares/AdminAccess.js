const { jwt, secretKey, pool } = require("../../puplic/modules/modules");
const { findUser } = require("../../sql/query");

async function AdminsAccess(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ error: "Unauthorized" });
  }

  try {
    const user = jwt.verify(authHeader, secretKey);

    const result = await pool.query(findUser.findByUsername, [user.username]);
    const dbUser = result.rows[0];

    if (!dbUser) {
      return res.status(401).send({ error: "Unauthorized" });
    }

    if (user.username !== dbUser.username) {
      return res.status(401).send({ error: "Unauthorized" });
    }

    if (dbUser.role !== "admin") {
      return res.status(403).send({ error: "Forbidden" });
    }

    req.me = { username: user.username, role: user.role };

    next();
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
}

module.exports = AdminsAccess;
