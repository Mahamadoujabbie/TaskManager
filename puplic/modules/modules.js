const { secretKey } = require("../../config/Jwt_config");
const pool = require("../../config/Database_config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

module.exports = { pool, bcrypt, jwt, secretKey, client };
