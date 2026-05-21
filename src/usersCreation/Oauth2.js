require("dotenv").config();
const { pool, client } = require("../../puplic/modules/modules");
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
      const { name, username } = payload;
      // Check if user exists in the database
      const result = await pool.query(findUser.findByUsername, [username]);
      let user = result.rows;
      if (!user || user.length === 0) {
        // If user doesn't exist, create a new user
        await pool.query(insertUser.createUser, [
          name,
          username,
          null,
          new Date().toISOString().split("T")[0],
          "active",
          "user",
        ]);
        return res.status(201).send({ message: "User created successfully" });
      }
      return res
        .status(200)
        .send({ message: "User authenticated successfully" });
    } catch (error) {
      console.error("Error verifying Google token:", error);
      return res.status(401).send({ error: "Invalid Google token" });
    }
  });
};
