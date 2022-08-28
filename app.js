const express = require("express");

const app = express();

app.get("/home", (req, res) => {
  res.send("hello");
});

// export app js
module.exports = app;
