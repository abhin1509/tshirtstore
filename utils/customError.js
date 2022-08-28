class CustomError extends Error {
  constructor(message, code) {
    supper(message);
    this.code = code;
  }
}

module.exports = CustomError;
