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
      // finding the user in the database by email (username)
      const result = await pool.query(findUser.findByUsername, [email]);
      let user = result.rows;

      // Check if user exists in the database
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

        // creating token for the new user
        const jwttoken = jwt.sign(
          { id: user[0].id, username: user[0].username, role: user[0].role },
          secretKey,
          { expiresIn: "1h" },
        );
        // sending the token to the client
        return res.status(201).send({ token: jwttoken });
      }

      // if user exists but is not active, return an error
      if (user[0].status !== "active") {
        return res.status(403).send({ error: "Unauthorized" });
      }
      // if user exists, create a token for the existing user
      const jwttoken = jwt.sign(
        { id: user[0].id, username: user[0].username, role: user[0].role },
        secretKey,
        { expiresIn: "1h" },
      );
      return res.status(200).send({ token: jwttoken });
    } catch (error) {
      console.error("Error verifying Google token:");
      return res.status(401).send({ error: "Invalid Google token" });
    }
  });
};
