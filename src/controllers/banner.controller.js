const Banner = require("../models/banner.model");
const response = require("../utils/response");

class BannerController {
  static async getBanner(req, res) {
    try {
      const result = await Banner.findAll();
      response.success(res, result, "Success");
    } catch (error) {
      response.error(res, error, "Failed");
    }
  }
}

module.exports = BannerController;
