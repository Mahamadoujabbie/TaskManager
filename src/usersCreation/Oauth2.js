require("dotenv").config();
const {
  pool,
  client,
  jwt,
  secretKey,
} = require("../../puplic/modules/modules");
const { findUser, insertUser } = require("../../sql/query");

module.exports = (Oauth2) => {
  Oauth2.post("/google-login", async (req, res) => {
    const { token } = req.body;
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const { name, email } = payload;
      // Check if user exists in the database
      const result = await pool.query(findUser.findByUsername, [email]);
      let user = result.rows;
      if (!user || user.length === 0) {
        // If user doesn't exist, create a new user
        await pool.query(insertUser.createUser, [
          name,
          email,
          "null_oauth1/google",
          new Date().toISOString().split("T")[0],
          "active",
          "user",
        ]);
        const jwttoken = jwt.sign(
          { id: user[0].id, username: user[0].username, role: user[0].role },
          secretKey,
          { expiresIn: "1h" },
        );
        return res.status(201).send({ jwttoken: jwttoken });
      }
      const jwttoken = jwt.sign(
        { id: user[0].id, username: user[0].username, role: user[0].role },
        secretKey,
        { expiresIn: "1h" },
      );
      return res.status(200).send({ jwttoken: jwttoken });
    } catch (error) {
      console.error("Error verifying Google token:", error);
      return res.status(401).send({ error: "Invalid Google token" });
    }
  });
};
