const BigPromise = require("../middleware/bigPromise");

exports.home = BigPromise(async (req, res) => {
  res.status(200).json({
    success: true,
    greeting: "Hello from server",
  });
});

// use either async - await with BigPromise || async - await with try catch

exports.homeDummy = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      greeting: "This is another dummy route",
    });
  } catch (error) {
    console.log(error);
  }
};
