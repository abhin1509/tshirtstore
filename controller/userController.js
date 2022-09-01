const User = require("../models/user");
const BigPromise = require("../middleware/bigPromise");
const CustomError = require("../utils/customError");
const cookieToken = require("../utils/cookieToken");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

exports.signup = BigPromise(async (req, res, next) => {
  if (!req.files) {
    return next(new CustomError("Photo is required for signup", 400));
  }

  const { name, email, password } = req.body;

  if (!email || !name || !password) {
    return next(new CustomError("Name, email and password are required", 400));
  }

  let file = req.files.photo;

  const result = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: "users",
    width: 150,
    crop: "scale",
  });

  const user = await User.create({
    name,
    email,
    password,
    photo: {
      id: result.public_id,
      secure_url: result.secure_url,
    },
  });

  cookieToken(user, res);
});

exports.login = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if both email and password received
  if (!email || !password) {
    return next(new CustomError("Please provide email and password", 400));
  }

  // checking user in db and also select password
  const user = await User.findOne({ email }).select("+password");

  // If user doesn't exist, we can also send msg that user is not registered
  if (!user) {
    return next(
      new CustomError("Email or password doesn't match or exist", 400)
    );
  }

  // checking password
  const isPasswordCorrect = await user.isValidPassword(password);

  // sending same msg for incorrect password, so user can't bruteforce
  if (!isPasswordCorrect) {
    return next(
      new CustomError("Email or password doesn't match or exist", 400)
    );
  }

  // send token
  cookieToken(user, res);
});
