const express = require("express");
const {
  addProduct,
  getAllProduct,
  adminGetAllProduct,
  getOneProduct,
  adminUpdateOneProduct,
} = require("../controller/productController");
const router = express.Router();
const { isLoggedIn, customRole } = require("../middleware/user");

// user routes
router.route("/products").get(getAllProduct);
router.route("/product/:id").get(getOneProduct);

// admin routes
router
  .route("/admin/product/add")
  .post(isLoggedIn, customRole("admin"), addProduct);
router
  .route("/admin/products")
  .get(isLoggedIn, customRole("admin"), adminGetAllProduct);
router
  .route("/admin/product/:id")
  .post(isLoggedIn, customRole("admin"), adminUpdateOneProduct);

module.exports = router;
