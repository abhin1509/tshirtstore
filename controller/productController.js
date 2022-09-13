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
    for (let index = 0; index < req.files.photos.length; index++) {
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
  const productsObj = new WhereClause(Product.find(), req.query)
    .search()
    .filter();
  let products = await productsObj.base;
  const filteredProductCount = products.length;

  // pagination
  // products.limit().skip();
  // Better way
  productsObj.pager(resultPerPage);
  products = await productsObj.base.clone();

  res.status(200).json({
    success: true,
    products,
    filteredProductCount,
    totalProductCount,
  });
});

exports.getOneProduct = BigPromise(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new CustomError("No product found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

exports.adminGetAllProduct = BigPromise(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

exports.adminUpdateOneProduct = BigPromise(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new CustomError("No product found", 404));
  }

  let imagesArray = [];

  if (req.files) {
    // destroy the existing images
    for (let index = 0; index < product.photos.length; index++) {
      const res = await cloudinary.uploader.destroy(product.photos[index].id);
    }

    // upload the current image
    for (let index = 0; index < req.files.photos.length; index++) {
      let result = await cloudinary.uploader.upload(
        req.files.photos[index].tempFilePath,
        {
          folder: "products",
        }
      );

      imagesArray.push({ id: result.public_id, secure_url: result.secure_url });
    }
  }

  req.body.photos = imagesArray;

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});
