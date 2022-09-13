const express = require("express");
const { testProduct } = require("../controller/productController");
const router = express.Router();

router.route("/testProduct").get(testProduct);

module.exports = router;
