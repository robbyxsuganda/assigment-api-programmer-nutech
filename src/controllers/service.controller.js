const Service = require("../models/service.model");
const response = require("../utils/response");

class ServiceController {
  static async getService(req, res) {
    try {
      const result = await Service.findAll();
      response.success(res, result, "Success");
    } catch (error) {
      response.error(res, error, "Failed");
    }
  }
}

module.exports = ServiceController;
