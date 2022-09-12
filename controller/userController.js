const User = require("../models/user");
const BigPromise = require("../middleware/bigPromise");
const CustomError = require("../utils/customError");
const cookieToken = require("../utils/cookieToken");
const fileUpload = require("express-fileupload");
const mailHelper = require("../utils/emailHelper");
const cloudinary = require("cloudinary").v2;
const crypto = require("crypto");

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

exports.logout = BigPromise(async (req, res, next) => {
  // we are storing token in cookie
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "logout success",
  });
  //todo: also remove token from db
});

exports.forgotPassword = BigPromise(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new CustomError("Email not registered!", 400));
  }

  // get token from user model
  const forgotToken = user.getForgotPasswordToken();

  // use to validate if certain fields are not there and save in db
  await user.save({ validateBeforeSave: false });

  // url for: /password/reset/:token
  const myUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${forgotToken}`;

  const message = `Copy paste this link in your URL and hit enter \n\n ${myUrl}`;

  try {
    await mailHelper({
      toMail: user.email,
      subject: "Tshirt store - Password reset email",
      text: message,
    });

    res.status(200).json({
      success: true,
      message: "email sent successfully",
    });
  } catch (error) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new CustomError(error.message, 500));
  }
});

exports.passwordReset = BigPromise(async (req, res, next) => {
  const token = req.params.token;

  // token is not encrypted, so encrypting
  const encryToken = crypto.createHash("sha256").update(token).digest("hex");

  // token is in db and is not expired
  const user = await User.findOne({
    encryToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return next(new CustomError("Token is invalid or expired", 400));
  }

  // can be checked at frontend as well
  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new CustomError("Password and confirm password do not match", 400)
    );
  }

  user.password = req.body.password;

  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  await user.save();

  // send a json response saying password reset so login
  // or send a token and log in

  cookieToken(user, res);
});

exports.getLoggedInUserDetails = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

exports.changePassword = BigPromise(async (req, res, next) => {
  // accessible only when loggedIn
  const userId = req.user.id;

  const user = await User.findById(userId).select("+password");

  const isCorrectOldPassword = await user.isValidPassword(req.body.oldPassword);

  if (!isCorrectOldPassword) {
    return next(new CustomError("Old password is incorrect", 400));
  }

  // if old password is correct update new password
  user.password = req.body.newPassword;

  await user.save();

  // update token
  cookieToken(user, res);
});

exports.updateUserDetails = BigPromise(async (req, res, next) => {
  //while updating get all the data from frontend, new as well as existing

  // check for name and email
  if (!req.body.name || !req.body.email) {
    return next(new CustomError("Please provide both name and email", 400));
  }

  const newData = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.files) {
    const user = await User.findById(req.user.id);

    const imageId = user.photo.id;

    // delete photo on cloudinary
    const resp = await cloudinary.uploader.destroy(imageId);

    // upload the new photo
    const result = await cloudinary.uploader.upload(
      req.files.photo.tempFilePath,
      {
        folder: "users",
        width: 150,
        crop: "scale",
      }
    );

    newData.photo = {
      id: result.public_id,
      secure_url: result.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user, //optional depends on frontend
  });
});

exports.adminAllUser = BigPromise(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

exports.adminGetOneUser = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new CustomError("No user found", 400));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

exports.adminUpdateOneUserDetails = BigPromise(async (req, res, next) => {
  //while updating get all the data from frontend, new as well as existing

  // check for name and email
  if (!req.body.name || !req.body.email) {
    return next(new CustomError("Please provide both name and email", 400));
  }

  const newData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user, //optional depends on frontend
  });
});

exports.adminDeleteOneUser = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new CustomError("No user found", 404));
  }

  const imageId = user.photo.id;

  await cloudinary.uploader.destroy(imageId);

  await user.remove();

  res.status(200).json({
    success: true,
  });
});

exports.managerAllUser = BigPromise(async (req, res, next) => {
  const users = await User.find({ role: "user" });

  res.status(200).json({
    success: true,
    users,
  });
});
