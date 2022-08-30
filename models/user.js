const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    maxlength: [40, "Name should be under 40 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    validate: [validator.isEmail, "Please enter email in correct format"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    maxlength: [6, "Password should be atleast 6 characters"],
    select: false, //password will not come when we get user
  },
  role: {
    type: String,
    default: "user",
  },
  photo: {
    id: {
      type: String,
    },
    secure_url: {
      type: String,
    },
  },
  forgotPasswordToken: String,
  forgotPasswordExpiry: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// encrypt password before save(pre) - HOOKS
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// validate the password with passed on user password
userSchema.methods.isValidPassword = async function (passwordFromUser) {
  let isPasswordMatched = await bcrypt.compare(passwordFromUser, this.password);
  return isPasswordMatched;
};

// create and return jwt token
userSchema.methods.getJwtToken = async function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

// generate forgot password token(string)
userSchema.methods.getForgotPasswordToken = function () {
  // generate random string
  const forgotToken = crypto.randomBytes(20).toString("hex");

  // getting a hash - make sure to get a hash on backend
  // we can also store forgot token directly to forgotPasswordToken
  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex");

  // time of token - 20 mins
  this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;
  return forgotToken;
};

module.exports = mongoose.model("User", userSchema);
