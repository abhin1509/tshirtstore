const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

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
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// morgan middleware
app.use(morgan("tiny"));

// all routes
const home = require("./routes/home");
const user = require("./routes/user");
const product = require("./routes/product");
const payment = require("./routes/payment");
const order = require("./routes/order");

// Router middleware
app.use("/api/v1", home);
app.use("/api/v1", user);
app.use("/api/v1", product);
app.use("/api/v1", payment);
app.use("/api/v1", order);

// export app js
module.exports = app;
