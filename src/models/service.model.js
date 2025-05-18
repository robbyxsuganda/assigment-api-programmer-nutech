const pool = require("../config/db.config");
const { ServiceClass } = require("./class");
class Service {
  static async findAll() {
    try {
      const query = `SELECT * FROM services`;

      const result = await pool.query(query);

      const instance = result.rows.map((el) => {
        return new ServiceClass(
          el.service_code,
          el.service_name,
          el.service_icon,
          Number(el.service_tariff)
        );
      });

      return instance;
    } catch (error) {
      throw error;
    }
  }
  static async getServiceByCode(serviceCode) {
    try {
      const query = `
      SELECT service_code, service_name, service_icon, service_tariff
      FROM services
      WHERE service_code = $1
    `;

      const result = await pool.query(query, [serviceCode]);

      if (result.rows.length === 0) {
        return null;
      }

      const instance = result.rows.map((el) => {
        return new ServiceClass(
          el.service_code,
          el.service_name,
          el.service_icon,
          el.service_tariff
        );
      });

      return instance[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Service;
