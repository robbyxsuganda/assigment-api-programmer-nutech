const User = require("../models/user.model");
const Service = require("../models/service.model");
const Transaction = require("../models/transaction.model");
const response = require("../utils/response");

class TransactionController {
  static async transaction(req, res) {
    try {
      const userId = req.loginInfo.userId;
      const { service_code } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return response.notFound(res, "User Not Found");
      }

      const service = await Service.getServiceByCode(service_code);
      if (!service) {
        return response.notFound(res, "Service ataus Layanan tidak ditemukan");
      }

      if (Number(user.balance) < Number(service.service_tariff)) {
        return response.error(res, null, "Saldo anda tidak mencukupi");
      }

      await User.updateBalance(
        userId,
        Number(service.service_tariff),
        "subtract"
      );

      const transactionData = {
        user_id: userId,
        transaction_type: "PAYMENT",
        service_code: service_code,
        amount: Number(service.service_tariff),
        description: `Pembayaran ${service.service_name}`,
      };

      const newTransaction = await Transaction.createTransaction(
        transactionData
      );

      const result = {
        invoice_number: newTransaction.invoice_number,
        service_code: newTransaction.service_code,
        service_name: service.service_name,
        transaction_type: newTransaction.transaction_type,
        total_amount: Number(newTransaction.amount),
        created_on: newTransaction.created_at,
      };

      response.success(res, result, "Transaksi Berhasil");
    } catch (error) {
      response.error(res, error, "Transaksi Gagal");
    }
  }

  static async getTransactionHistory(req, res) {
    try {
      const userId = req.loginInfo.userId;
      const limit = req.query.limit;
      const offset = req.query.offset;

      const user = await User.findById(userId);
      if (!user) {
        return response.notFound(res, null, "User not found");
      }

      const transactions = await Transaction.getTransactionsByUserId(
        userId,
        limit,
        offset
      );

      const formattedTransactions = transactions.map((transaction) => ({
        invoice_number: transaction.invoice_number,
        transaction_type: transaction.transaction_type,
        description: transaction.description,
        total_amount: Number(transaction.amount),
        created_on: transaction.created_at,
      }));

      const result = {
        offset: Number(offset),
        limit: Number(limit),
        records: formattedTransactions,
      };

      response.success(res, result, "Get History Berhasil");
    } catch (error) {
      response.error(res, error, "Get History Failed");
    }
  }
}

module.exports = TransactionController;
