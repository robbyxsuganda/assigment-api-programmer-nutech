const pool = require("../config/db.config");
const { BannerClass } = require("./class");

class Banner {
  static async findAll() {
    try {
      const query = `SELECT * FROM banners`;

      const result = await pool.query(query);

      const instance = result.rows.map((el) => {
        return new BannerClass(el.banner_name, el.banner_image, el.description);
      });

      return instance;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Banner;
