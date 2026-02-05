const { users, jwt, secretKey } = require("../app");

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ error: "Unauthorized" });
  }

  try {
    const user = jwt.verify(authHeader, secretKey);
    req.me = { username: user.username };
    next();
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
}

module.exports = authenticate;
