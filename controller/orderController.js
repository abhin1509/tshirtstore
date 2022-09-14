const Order = require("../models/order");
const Product = require("../models/product");

const BigPromise = require("../middleware/bigPromise");

exports.createOrder = BigPromise(async (req, res, next) => {

  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    taxAmount,
    shippingAmount,
    totalAmount,
  } = req.body;

  // todo: validate the incoming data from db as well
  // mongodb is bson and we are getting data as json
  // so validate req.user._id
  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    taxAmount,
    shippingAmount,
    totalAmount,
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    order,
  });
});
