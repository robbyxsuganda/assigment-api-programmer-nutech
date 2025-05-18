const { hash } = require("../utils/bcrypt.js");
const pool = require("../config/db.config.js");

class User {
  static async create(userData) {
    try {
      const { email, first_name, last_name, password } = userData;

      const errors = this.validation(email, password);

      if (errors.length > 0) {
        throw {
          name: "ValidationError",
          errors: errors,
        };
      }

      const hashPassword = hash(password);

      if (email) {
      }

      const query = `
      INSERT INTO users (email, first_name, last_name, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, first_name, last_name, created_at
    `;

      const values = [email, first_name, last_name || "", hashPassword];

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(userData) {
    try {
      const { userId, first_name, last_name } = userData;

      const query = `
              UPDATE users
              SET first_name = $2, last_name = $3, updated_at = CURRENT_TIMESTAMP
              WHERE id = $1
              RETURNING id, email, first_name, last_name, profile_image, created_at, updated_at
            `;

      const values = [userId, first_name, last_name || ""];

      const result = await pool.query(query, values);

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async updateImage(userData) {
    try {
      const { userId, profile_image } = userData;

      const query = `
              UPDATE users
              SET profile_image = $2, updated_at = CURRENT_TIMESTAMP
              WHERE id = $1
              RETURNING id, email, first_name, last_name, profile_image, created_at, updated_at
            `;

      const values = [userId, profile_image];

      const result = await pool.query(query, values);

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async updateBalance(userId, amount, type) {
    try {
      let query;

      if (type === "add") {
        query = `
        UPDATE users
        SET balance = balance + $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING id, email, first_name, last_name, balance, created_at, updated_at
      `;
      } else if (type === "subtract") {
        query = `
        UPDATE users
        SET balance = balance - $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING id, email, first_name, last_name, balance, created_at, updated_at
      `;
      } else {
        throw new Error("Invalid update balance type");
      }

      const result = await pool.query(query, [userId, amount]);

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const query = "SELECT * FROM users WHERE email = $1";
      const result = await pool.query(query, [email]);

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const query =
        "SELECT id, email, first_name, last_name, profile_image, balance, created_at, updated_at FROM users WHERE id = $1";
      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static validation(email, password) {
    try {
      const errors = [];

      if (!email) {
        errors.push("Email is required");
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          errors.push("Invalid email format");
        }
      }

      if (!password) {
        errors.push("Password is required");
      } else {
        if (password.length < 8) {
          errors.push("Password must be at least 8 characters long");
        }
      }

      return errors;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
