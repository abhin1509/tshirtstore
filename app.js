const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("hello");
});

// export app js
module.exports = app;
