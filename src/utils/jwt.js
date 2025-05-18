const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET || "rahasia";

const signToken = (payload) => {
  return jwt.sign(payload, secretKey, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, secretKey);
};

module.exports = { signToken, verifyToken };
