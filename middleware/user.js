const User = require("../models/user");
const BigPromise = require("./bigPromise");
const CustomError = require("../utils/customError");
const jwt = require("jsonwebtoken");

exports.isLoggedIn = BigPromise(async (req, res, next) => {
  const token =
    req.cookies.token || req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    return next(new CustomError("Login first to access this page", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // user is our created variable
  req.user = await User.findById(decoded.id);

  next();
});

exports.customRole = (...roles) => {
  // we will take as an array(roles) of one item, not as a string
  return (req, res, next) => {
    // it will be accessible after loggedIn
    if (!roles.includes(req.user.role)) {
      return next(
        new CustomError("You are not allowed to access this resource"),
        403
      );
    }
    next();
  };
  // old way
  // if(req.user.role === 'admin') {
  //   next();
  // }
};
