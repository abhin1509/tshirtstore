const express = require("express");
const {
  createOrder,
  getOneOrder,
  getAllMyOrders,
  adminGetAllOrders,
  adminUpdateOrder,
  adminDeleteOrder,
} = require("../controller/orderController");
const router = express.Router();
const { isLoggedIn, customRole } = require("../middleware/user");

router.route("/order/create").post(isLoggedIn, createOrder);
router.route("/order/getallmyorders").get(isLoggedIn, getAllMyOrders);
router.route("/order/:id").get(isLoggedIn, getOneOrder);

// admin route
router
  .route("/admin/orders")
  .get(isLoggedIn, customRole("admin"), adminGetAllOrders);
router
  .route("/admin/order/:id")
  .put(isLoggedIn, customRole("admin"), adminUpdateOrder)
  .delete(isLoggedIn, customRole("admin"), adminDeleteOrder);

module.exports = router;
