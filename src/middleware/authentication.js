const { verifyToken } = require("../utils/jwt");
const User = require("../models/user.model");
const response = require("../utils/response");

const authentication = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization)
      return response.unauthorized(
        res,
        "Token tidak tidak valid atau kadaluwarsa"
      );

    const [prefix, access_token] = authorization.split(" ");

    if (!(prefix === "Bearer" && access_token)) {
      return response.unauthorized(
        res,
        "Token tidak tidak valid atau kadaluwarsa"
      );
    }

    const payload = verifyToken(access_token);

    const user = await User.findByEmail(payload.email);

    if (!user) {
      return response.unauthorized(
        res,
        "Token tidak tidak valid atau kadaluwarsa"
      );
    }

    req.loginInfo = {
      userId: user.id,
      email: user.email,
    };

    next();
  } catch (error) {
    response.error(res, error, "Error Authentication");
  }
};

module.exports = authentication;
