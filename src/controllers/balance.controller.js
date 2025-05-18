const User = require("../models/user.model");
const Transaction = require("../models/transaction.model");
const response = require("../utils/response");

class BalanceController {
  static async getBalance(req, res) {
    try {
      const userId = req.loginInfo.userId;

      const user = await User.findById(userId);
      if (!user) {
        return response.notFound(res, "User not found");
      }

      response.success(
        res,
        { balance: Number(user.balance) },
        "Get Balance Berhasil"
      );
    } catch (error) {
      response.error(res, error, "Get ballance gagal");
    }
  }

  static async topUp(req, res) {
    try {
      const userId = req.loginInfo.userId;

      const amount = Number(req.body.amount);

      if (isNaN(amount) || amount < 1) {
        return response.error(
          res,
          null,
          "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0"
        );
      }

      const user = await User.findById(userId);
      if (!user) {
        return response.notFound(res, "User not found");
      }

      const updatedUser = await User.updateBalance(userId, amount, "add");

      const transactionData = {
        user_id: userId,
        transaction_type: "TOPUP",
        service_code: null,
        amount,
        description: "Top Up Saldo",
      };

      await Transaction.createTransaction(transactionData);

      const result = {
        balance: Number(updatedUser.balance),
      };

      response.success(res, result, "Top up balance berhasil");
    } catch (error) {
      response.error(res, error, "Top up balance gagal");
    }
  }
}

module.exports = BalanceController;
