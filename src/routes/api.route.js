const BannerController = require("../controllers/banner.controller");
const BalanceController = require("../controllers/balance.controller");
const ServiceController = require("../controllers/service.controller");
const UserController = require("../controllers/user.controller");
const authentication = require("../middleware/authentication");
const upload = require("../utils/multer");
const TransactionController = require("../controllers/transaction.controller");

const router = require("express").Router();

router.post("/registration", UserController.register);
router.post("/login", UserController.login);

router.get("/banner", BannerController.getBanner);

router.use(authentication);

router.get("/profile", UserController.profile);
router.put("/profile/update", UserController.profileUpdate);
router.put(
  "/profile/image",
  upload.single("file"),
  UserController.profileImage
);

router.get("/services", ServiceController.getService);

router.get("/balance", BalanceController.getBalance);
router.post("/topup", BalanceController.topUp);
router.post("/transaction", TransactionController.transaction);
router.get("/transaction/history", TransactionController.getTransactionHistory);

module.exports = router;
