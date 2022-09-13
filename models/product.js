const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide product name"],
    trim: true, //trailing spaces will be removed
    maxlength: [120, "Product name should not be more than 120 characters"],
  },
  price: {
    type: Number,
    required: [true, "please provide product price"],
    maxlength: [5, "Product price should not be more than 5 digits"],
  },
  description: {
    type: String,
    required: [true, "please provide product description"],
  },
  photos: [
    {
      id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [
      true,
      "Please select from short-sleeves, long-sleeves, sweat-shirts, hoodies",
    ],
    enum: {
      values: ["short-sleeves", "long-sleeves", "sweat-shirt", "hoodies"],
      message:
        "Please select ONLY from short-sleeves, long-sleeves, sweat-shirts and hoodies",
    },
  },
  brand: {
    type: String,
    required: [true, "please add a brand for clothing"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  numberOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User", //same as mongoose.model('User',)
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    //who added the field
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, //we don't want to execute now so don't write like now()
  },
});

module.exports = mongoose.model("Product", productSchema);
// Inside db it will be products instead of Product
