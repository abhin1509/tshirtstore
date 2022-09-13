const Product = require("../models/product");
const BigPromise = require("../middleware/bigPromise");
const CustomError = require("../utils/customError");
const WhereClause = require("../utils/whereClause");
const cloudinary = require("cloudinary").v2;

exports.addProduct = BigPromise(async (req, res, next) => {
  // images

  let imageArray = [];

  if (!req.files) {
    return next(new CustomError("Images are required", 401));
  }

  if (req.files) {
    for (let index = 0; index < array.length; index++) {
      let result = await cloudinary.uploader.upload(
        req.files.photos[index].tempFilePath,
        {
          folder: "products",
        }
      );

      imageArray.push({ id: result.public_id, secure_url: result.secure_url });
    }
  }

  req.body.photos = imageArray;

  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(200).json({
    success: true,
    product,
  });
});

exports.getAllProduct = BigPromise(async (req, res, next) => {
  const totalProductCount = await Product.countDocuments();
  // const products = await Product.find({}); //direct method

  // Better method
  const resultPerPage = 6; // 3 products in 2 rows
  const products = new WhereClause(Product.find(), req.query).search().filter();

  const filteredProductCount = products.length;

  // pagination
  // products.limit().skip();
  // Better way
  products.pager(resultPerPage);
  products = await products.base;

  res.status(200).json({
    success: true,
    products,
    filteredProductCount,
    totalProductCount,
  });
});
