const express = require("express");
const app = express();

// Routes
const home = require("./routes/home");


// Router middleware
app.use('/api/v1', home);

// export app js
module.exports = app;
