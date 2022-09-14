const express = require("express");
const { createOrder } = require("../controller/orderController");
const router = express.Router();
const { isLoggedIn, customRole } = require("../middleware/user");

router.route("/order/create").post(isLoggedIn, createOrder);

module.exports = router;
