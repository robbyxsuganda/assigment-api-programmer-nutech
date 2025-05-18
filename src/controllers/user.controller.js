const User = require("../models/user.model");
const response = require("../utils/response");
const { compare } = require("../utils/bcrypt.js");
const { signToken } = require("../utils/jwt.js");
const cloudinary = require("../utils/cloudinary");

class UserController {
  static async register(req, res) {
    try {
      const { email } = req.body;

      const user = await User.findByEmail(email);

      if (user) {
        return response.error(res, null, "Email Sudah Terdaftar");
      }
      const result = await User.create(req.body);

      response.success(res, result, "Registrasi berhasil silahkan login");
    } catch (error) {
      response.error(res, error, "Resitration Failed");
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findByEmail(email);
      if (!user) {
        return response.unauthorized(res, "Email or Password salah");
      }

      const isPasswordValid = compare(password, user.password);
      if (!isPasswordValid) {
        return response.unauthorized(res, "Email or Password salah");
      }

      const token = signToken({ id: user.id, email: user.email });

      response.success(res, { token }, "Login Success");
    } catch (error) {
      response.error(res, error, "Login Failed");
    }
  }

  static async profile(req, res) {
    try {
      const userId = req.loginInfo.userId;

      const user = await User.findById(userId);
      if (!user) {
        return response.unauthorized(
          res,
          "Token tidak tidak valid atau kadaluwarsa"
        );
      }

      const result = {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name || "",
        profille_image: user.profille_image || "",
      };

      response.success(res, result, "Success");
    } catch (error) {
      response.error(res, error, "Failed");
    }
  }

  static async profileUpdate(req, res) {
    try {
      const userId = req.loginInfo.userId;
      const { first_name, last_name } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return response.notFound(res, "User Not Found");
      }

      const updatedUser = await User.update({ userId, first_name, last_name });

      const result = {
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name || "",
        email: updatedUser.email,
        profile_image: updatedUser.profile_image || "",
      };

      response.success(res, result, "Success Update Profile");
    } catch (error) {
      response.error(res, error, "Failed Update Profile");
    }
  }

  static async profileImage(req, res) {
    try {
      if (
        !req.file ||
        !["image/jpeg", "image/jpg", "image/png"].includes(req.file.mimetype)
      ) {
        return response.error(res, null, "Format Image tidak sesuai");
      }

      const userId = req.loginInfo.userId;

      const base64Data = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString("base64")}`;

      const uploadResult = await cloudinary.uploader.upload(base64Data, {
        resource_type: "auto",
      });

      const profile_image = uploadResult.secure_url;

      const result = await User.updateImage({ profile_image, userId });

      response.success(res, result, "Success Update Profile Image");
    } catch (error) {
      response.error(res, error, "Failed Update Profile Image");
    }
  }
}

module.exports = UserController;
