const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

// for swagger documentation
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// regular middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookies and fileUpload middleware
app.use(cookieParser());
app.use(fileUpload());

// morgan middleware
app.use(morgan("tiny"));

// Routes
const home = require("./routes/home");

// Router middleware
app.use("/api/v1", home);

// export app js
module.exports = app;
