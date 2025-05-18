const pool = require("../config/db.config");
const crypto = require("crypto");

class Transaction {
  static async createTransaction(transactionData) {
    try {
      const { user_id, transaction_type, service_code, amount, description } =
        transactionData;

      const timestamp = Date.now().toString();
      const randomString = crypto.randomBytes(4).toString("hex");
      const invoiceNumber = `INV-${timestamp.substring(
        timestamp.length - 8
      )}-${randomString}`;

      const query = `
      INSERT INTO transactions (user_id, transaction_type, service_code, amount, description, invoice_number)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, user_id, transaction_type, service_code, amount, description, invoice_number, created_at
    `;

      const values = [
        user_id,
        transaction_type,
        service_code,
        amount,
        description,
        invoiceNumber,
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getTransactionsByUserId(userId, limit, offset) {
    try {
      let query = `
      SELECT t.id, t.transaction_type, t.amount, t.created_at, t.invoice_number, t.description
      FROM transactions t
      WHERE t.user_id = $1
      ORDER BY t.created_at DESC
    `;

      const values = [userId];
      let paramIndex = 2;

      if (limit) {
        query += ` LIMIT $${paramIndex}`;
        values.push(parseInt(limit));
        paramIndex++;
      }

      if (offset !== undefined) {
        query += ` OFFSET $${paramIndex}`;
        values.push(parseInt(offset));
      }

      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Transaction;
